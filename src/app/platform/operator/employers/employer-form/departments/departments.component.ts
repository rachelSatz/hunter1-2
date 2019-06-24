import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { DepartmentService } from 'app/shared/_services/http/department.service';


@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
})
export class DepartmentsComponent implements OnInit  {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  role = this.userSession.getRole() !== 'employer';

  constructor(private route: ActivatedRoute,
              private departmentService: DepartmentService,
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

  fetchItems() {

    this.departmentService.getDepartments(this.selectUnit.currentEmployerID)
      .then(response => this.dataTable.setItems(response));
  }


}
