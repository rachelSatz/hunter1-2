import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { NotificationService } from 'app/shared/_services/notification.service';


@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
})
export class DepartmentsComponent implements OnInit  {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;
  role = this.userSession.getRole() !== 'employer';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private departmentService: DepartmentService,
              protected notificationService: NotificationService,
              public userSession: UserSessionService,
              private selectUnit: SelectUnitService) {
  }

  readonly columns =  [
    { name: 'name', label: 'שם מחלקה' },
    { name: 'id', label: 'מספר מחלקה' }
  ];

  ngOnInit() {
    this.dataTable.criteria.limit = 5;
  }

  navigateForm(itemId) {
    this.router.navigate(['./', 'form', itemId], {relativeTo: this.route});
  }

  fetchItems() {
    this.departmentService.getDepartments(this.selectUnit.currentEmployerID)
      .then(response => this.dataTable.setItems(response));
  }

  deleteDepartment(id): void {
    this.departmentService.delete(id)
      .then(response => {
        if (response) {
          this.fetchItems();
        } else {
          this.notificationService.error('שגיאה במחיקת מחלקה');
        }
      });
  }



}
