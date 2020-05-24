import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableComponent} from '../../../../shared/data-table/data-table.component';
import {Subscription} from 'rxjs';
import {GroupMembersDialogComponent} from '../../groups/group-members-dialog/group-members-dialog.component';
import {SelectUnitService} from '../../../../shared/_services/select-unit.service';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../../shared/_services/notification.service';
import {MatDialog} from '@angular/material/dialog';
import {HelpersService} from '../../../../shared/_services/helpers.service';
import {GroupService} from '../../../../shared/_services/http/group.service';

@Component({
  selector: 'app-group-select-campaigns',
  templateUrl: './group-select-campaigns.component.html',
  styleUrls: ['./group-select-campaigns.component.css']
})
export class GroupSelectCampaignsComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;
  sub = new Subscription;

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
              protected helpers: HelpersService,
              private groupService: GroupService) { }

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
    this.groupService.getGroups(this.dataTable.criteria)
      .then(response => {
        this.dataTable.setItems(response);
      });
  }

  openGroupMembersDialog(group: any): void {
    this.helpers.setPageSpinner(true);
    this.groupService.getAllEmployersGroup(group.id).then(response => {
      this.helpers.setPageSpinner(false);
      // this.dialog.open(GroupMembersDialogComponent, {
      //   data: { items: response.items,
      //     groupSize: group.group_size,
      //     groupName: group.name},
      //   width: '450px',
      //   height: '500px',
      //   panelClass: 'group-select-campaigns',
      // });
    });
  }

}
