import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { DepartmentService } from 'app/shared/_services/http/department.service';

@Component({
  selector: 'app-manufacturer-number',
  templateUrl: './manufacturer-number.component.html',
})
export class ManufacturerNumberComponent implements OnInit {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns =  [
    { name: 'product_id', label: 'מחלקה' },
    { name: 'company_name', label: 'שם חברה' },
    { name: 'bank', label: 'שם עובד' },
    { name: 'branch', label: 'מספר' },
  ];

  role = this.userSession.getRole() !== 'employer';
  constructor(protected route: ActivatedRoute,
              private router: Router,
              private userSession: UserSessionService,
              private departmentService: DepartmentService,
              private selectUnit: SelectUnitService) {
  }

  ngOnInit() {
    this.dataTable.criteria.limit = 5;

  }

  fetchItems() {
    this.departmentService.getSNInEmployer(this.selectUnit.currentEmployerID)
      .then(response => this.dataTable.setItems(response));

  }
}
