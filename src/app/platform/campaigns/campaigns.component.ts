import { Component, OnInit, ViewChild} from '@angular/core';
import { DataTableComponent} from '../../shared/data-table/data-table.component';
import { UserSessionService} from '../../shared/_services/user-session.service';
import { SelectUnitService} from '../../shared/_services/select-unit.service';
import { ActivatedRoute, Router} from '@angular/router';
import { Subscription} from 'rxjs';
import { CampaignsService} from '../../shared/_services/http/campains.service';
import {CampaignsStatus} from '../../shared/_models/campaigns';
import {GroupMembersDialogComponent} from './group-members-dialog/group-members-dialog.component';
import {HelpersService} from '../../shared/_services/helpers.service';
import {MatDialog} from '@angular/material/dialog';
import {NotificationService} from '../../shared/_services/notification.service';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;
  sub = new Subscription;
  campaignStatus = CampaignsStatus;

  readonly columns =  [
    { name: 'name', label: 'שם הקמפיין', searchable: false },
    { name: 'type', label: 'סוג המודל', searchable: false },
    { name: 'subtype', label: 'שם המודל', searchable: false },
    { name: 'status', label: 'סטטוס' , searchable: false},
    { name: 'last_send', label: 'מועד שליחה אחרון' , searchable: false},
    { name: 'next_send', label: 'מועד שליחה הבא' , searchable: false},
    { name: 'amount', label: 'כמות נשלח' , searchable: false},
  ];
  constructor(
    private router: Router,
    public  userSession: UserSessionService,
    protected route: ActivatedRoute,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    public helpers: HelpersService,
    public campaignsService: CampaignsService,
    private selectUnit: SelectUnitService
  ) { }

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

  openGroupMembersDialog(campaign: any): void {
    this.helpers.setPageSpinner(true);
    this.campaignsService.getAllEmployersCampaign(campaign.id).then(response => {
      this.helpers.setPageSpinner(false);
      this.dialog.open(GroupMembersDialogComponent, {
        data: { items: response.items,
          groupSize: response.items.length,
          groupName: campaign.name,
          mode: 'submit'},
        width: '500px',
        height: '550px',
        panelClass: 'campaigns',
      });
    });
  }

  deleteExistCampaign() {
    this.selectUnit.clearTaskCampaign();
  }

  fetchItems() {
    this.campaignsService.getCampaigns(this.dataTable.criteria).then(
      response => this.setResponse(response));
  }

  editCampaign(campaign_id) {
    this.selectUnit.clearTaskCampaign();
    this.router.navigate(['/platform', 'operator', 'campaigns',  'campaigns-form'], { queryParams: { campaignId: campaign_id }});
  }

  setResponse(response: any): void {
    this.dataTable.setItems(response);
  }

}
