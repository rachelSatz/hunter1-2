import {  Component, Inject, OnInit, ViewChild} from '@angular/core';
import {  MAT_DIALOG_DATA} from '@angular/material/dialog';
import {  DataTableComponent} from '../../../shared/data-table/data-table.component';
import {  GroupService} from '../../../shared/_services/http/group.service';
import {  Subscription} from 'rxjs';
import {  SelectUnitService} from '../../../shared/_services/select-unit.service';
import {  ActivatedRoute, Router} from '@angular/router';
import {  NotificationService} from '../../../shared/_services/notification.service';

@Component({
  selector: 'app-edit-group-employer',
  templateUrl: './edit-group-employer.component.html',
  styleUrls: ['./edit-group-employer.component.css']
})
export class EditGroupEmployerComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;
  sub = new Subscription;
  items;
  group;
  readonly columns =  [
    { name: 'organization', label: 'ארגון', searchable: false },
    { name: 'employer', label: 'מעסיק' , searchable: false},
  ];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public groupService: GroupService,
              protected route: ActivatedRoute,
              private router: Router,
              public notificationService: NotificationService,
              private selectUnit: SelectUnitService) { }

  ngOnInit() {
    this.group = this.data.groupCurrent;
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
        this.router.navigate([], {
          queryParams: {page: 1},
          relativeTo: this.route
        });
        this.fetchItems();
      }
    ));
  }

  removeEmployerGroup(): void {
    if (this.dataTable.criteria.checkedItems.length !== 0) {
      const ids = this.dataTable.criteria.checkedItems.map(i => i['id']);
      this.groupService.deleteEmployerGroup(ids, this.group.id).then(
        response => {
          if (response) {
            this.notificationService.success('המחיקה בוצע בהצלחה' );
            this.fetchItems();
          }else  {
            this.notificationService.error('המחיקה נכשלה', 'אין אפשרות למחוק קובץ ששודר');
          }
        }
      );
    }
  }

  fetchItems() {
    this.groupService.getAllEmployersGroup(this.group.id).then(response => {
      this.dataTable.setItems(response);
    });
  }
}
