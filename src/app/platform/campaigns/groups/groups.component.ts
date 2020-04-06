import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {Subscription} from 'rxjs';
import {DataTableComponent} from '../../../shared/data-table/data-table.component';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupService} from '../../../shared/_services/http/group.service';
import {HelpersService} from '../../../shared/_services/helpers.service';
import {GroupMembersDialogComponent} from './group-members-dialog/group-members-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {NotificationService} from '../../../shared/_services/notification.service';
import {AddToGroupDialogComponent} from './add-to-group-dialog/add-to-group-dialog.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;
  sub = new Subscription;

  year: number;

  isActive = true;
  hasActionPermission: boolean;

  readonly columns = [
    { name: 'name', label: 'שם קבוצה' },
    { name: 'created_at', label: 'תאריך יצירה' },
    { name: 'group_size', label: 'נמענים', searchable: false},
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

  openAddToGroupDialog(mode: string, groupId?: number, groupName?: string): void {
    const dialog = this.dialog.open(AddToGroupDialogComponent, {
      data: {
              mode: mode,
              groupId: 	groupId,
              groupName:	groupName,
      },
      width: '475px',
      panelClass: 'groups',
    });

    this.sub.add(dialog.afterClosed().subscribe(message => {
        if (message) {
          this.fetchItems();
        }
      })
    );
  }

  openGroupMembersDialog(group: any): void {
    this.helpers.setPageSpinner(true);
    this.groupService.getAllEmployersGroup(group.id).then(response => {
      this.helpers.setPageSpinner(false);
      this.dialog.open(GroupMembersDialogComponent, {
        data: { items: response.items,
                groupSize: group.group_size,
                groupName: group.name},
        width: '450px',
        height: '500px',
        panelClass: 'groups',
      });
    });
  }

  deleteGroup(groupId: number, groupName: string): void {
    this.notificationService.warning('למחוק את ' + groupName + '?')
      .then((result) => {
        if (result.value) {
          this.groupService.deleteGroup(groupId).then(response => {
            if (response) {
              this.notificationService.success(groupName + ' נמחקה');
            } else {
              this.notificationService.error('נסה שנית או צור קשר.', 'שגיאה כללית.');
              return;
            }
            this.fetchItems();
          });
        }
      });
  }

  // ngOnDestroy() {
  //   this.sub.unsubscribe();
  // }

}
