import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { DataTableComponent} from '../../../../shared/data-table/data-table.component';
import { Subscription} from 'rxjs';
import { GroupMembersDialogComponent} from '../../group-members-dialog/group-members-dialog.component';
import { SelectUnitService} from '../../../../shared/_services/select-unit.service';
import {DatePipe, Location} from '@angular/common';
import { ActivatedRoute, Router} from '@angular/router';
import { NotificationService} from '../../../../shared/_services/notification.service';
import { MatDialog} from '@angular/material/dialog';
import { HelpersService} from '../../../../shared/_services/helpers.service';
import { GroupService} from '../../../../shared/_services/http/group.service';
import { FormBuilder} from '@angular/forms';
import { CampaignsFieldStatus, SentTypeStatus} from '../../../../shared/_models/campaigns';
import {CampaignsService} from '../../../../shared/_services/http/campains.service';
import {fade} from '../../../../shared/_animations/animation';
import {TaskCampaignService} from '../../../../shared/_services/campaign-data-service';

@Component({
  selector: 'app-group-select-campaigns',
  templateUrl: './group-select-campaigns.component.html',
  styleUrls: ['./group-select-campaigns.component.css'],
  animations: [ fade ]
})
export class GroupSelectCampaignsComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  groups = this.fb.group({
    'groupCampaign' : this.fb.group ({
      'groups': [null],
      'isCheckAll' : [false]
    }),
});

  sub = new Subscription;
  date = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
  campaignStatus = CampaignsFieldStatus;
  campaignSent = SentTypeStatus;
  taskCampaignForm;
  model = '';
  modelName = '';
  page = 1;
  dateSend = '';

  isSubmitted = false;
  readonly columns = [
    { name: 'name', label: 'שם קבוצה' },
    { name: 'created_at', label: 'תאריך יצירה' },
    { name: 'group_size', label: 'נמענים'},
  ];

  constructor(private selectUnit: SelectUnitService,
              private _location: Location,
              private router: Router,
              protected route: ActivatedRoute,
              private notificationService: NotificationService,
              private dialog: MatDialog,
              public campaignsService: CampaignsService,
              public fb: FormBuilder,
              public datePipe: DatePipe,
              protected helpers: HelpersService,
              private groupService: GroupService,
              public taskCampaignService: TaskCampaignService,
              public selectUnitService: SelectUnitService) { }

  ngOnInit() {
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
        this.router.navigate([], {
          queryParams: {page: 1},
          relativeTo: this.route
        });
        this.fetchItems();
      }
    ));
  }

  fetchItems(): void {
    this.dataTable.criteria.limit = 6;
    this.groupService.getGroups(this.dataTable.criteria)
      .then(response => {
        this.dataTable.setItems(response);
        this.setData();
      });
  }

  setData() {
    if (this.taskCampaignService.activeCampaigns !== undefined) {
      this.selectUnitService.setTaskCampaign(this.taskCampaignService);
    } else {
      this.taskCampaignService = this.selectUnitService.getTaskCampaign();
    }
    this.taskCampaignForm = this.taskCampaignService.activeCampaigns;
    this.dateSend = this.taskCampaignForm.timings.sendNow ? 'מיידי' : 'עתידית';
    this.campaignsService.getTypes().then(response => {
      const campaignsType = response;
      const moduleType = this.taskCampaignForm.details.moduleType;
      if (moduleType === '0') {
        this.model = 'הודעות מותאמות';
      } else {
        this.model = campaignsType.find(a => a.id === moduleType).name;
        this.modelName = campaignsType.find(a => a.id === moduleType).subtype.find(
          b => b.id === this.taskCampaignForm.details.moduleName).name;
      }
    });
    if (this.taskCampaignForm.groups.groups[0] !== 0) {
      this.groups.get('groupCampaign').patchValue(this.taskCampaignForm.groups);
      const item = this.dataTable.items.filter( a => {if (this.taskCampaignForm.groups.groups.includes(a.id)) {a.checked = true; }});
      if (item) {
        this.dataTable.checkItem(item, true);
      }
    }
  }

  validateGroups(item: Object, isChecked: boolean) {
    if (item['group_size'] > 0 || this.dataTable.criteria.isCheckAll) {
      item['loading'] = true;
      this.dataTable.checkItem(item, isChecked);
      setTimeout(() => item['loading'] = false, 0);
    }
  }

  back() {
    if (this.page === 1) {
      this._location.back();
    } else {
      const url: string = this.router.url.substring(0, this.router.url.indexOf('?'));
      this.router.navigateByUrl(url);
      this.page = 1;
    }
  }

  private handleResponse(response: string): void {
    if (response) {
      if (response['massage'] === 'success') {
        this.notificationService.success('הקמפיין נשלח בהצלחה');
        this.selectUnitService.clearTaskCampaign();
        this.router.navigate(['/platform', 'operator', 'campaigns']);
      }
      if (response['massage'] === 'bad request') {
        this.notificationService.error('שליחת ויצירת הקמפיין נכשל');
      }
    }
  }

  continue() {
    if (this.page === 1) {
      this.isSubmitted = true;
      if (this.dataTable.criteria.checkedItems.length > 0 || this.dataTable.criteria.isCheckAll ||
        this.groups.get('groupCampaign.groups').value.length > 0) {
        this.page = 2;
        this.taskCampaignService.activeCampaigns.groups.groups = this.groups.get('groupCampaign.groups').value;
        this.taskCampaignService.activeCampaigns.groups.isCheckAll = this.groups.get('groupCampaign.isCheckAll').value;
        this.groups.get('groupCampaign.groups').patchValue(this.dataTable.criteria.checkedItems.map(value => value['id']));
        this.groups.updateValueAndValidity();
        this.groups.get('groupCampaign.isCheckAll').patchValue(this.dataTable.criteria.isCheckAll);
        this.taskCampaignService.setGroups(this.groups.get('groupCampaign').value);
        this.selectUnitService.setTaskCampaign(this.taskCampaignService);
        this.router.navigate([], {relativeTo: this.route, queryParams: {send: ''},
          queryParamsHandling: 'merge',
          skipLocationChange: true
        });
      }
    } else {
      this.sendCampaign();
    }
  }

  sendCampaign() {
    if (this.groups.valid) {
      this.helpers.setPageSpinner(true);
      if (this.selectUnitService.getTaskCampaign().activeCampaigns.details.id) {
        this.campaignsService.updateCampaign(this.taskCampaignForm, this.groups.value.groupCampaign)
          .then(response => {
            this.helpers.setPageSpinner(false);
            this.handleResponse(response);
          });
      } else {
        this.campaignsService.createCampaign(this.taskCampaignForm, this.groups.value.groupCampaign)
          .then(response => {
            this.helpers.setPageSpinner(false);
            this.handleResponse(response);
          });
      }
    }
  }

  openGroupMembersDialog(group: any): void {
    this.helpers.setPageSpinner(true);
    this.groupService.getAllEmployersGroup(group.id).then(response => {
      this.helpers.setPageSpinner(false);
      this.dialog.open(GroupMembersDialogComponent, {
        data: { items: response.items,
          groupSize: group.group_size,
          groupName: group.name},
        width: '400px',
        height: '450px',
        panelClass: 'group-select-campaigns',
      });
    });
  }

}
