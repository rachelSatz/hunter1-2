import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';

import { DepartmentService } from 'app/shared/_services/http/department.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';


@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['../../../../../shared/data-table/data-table.component.css']
})
export class DepartmentsComponent extends DataTableComponent implements OnInit , OnDestroy {

  constructor(route: ActivatedRoute,
              private departmentService: DepartmentService,
              private selectUnit: SelectUnitService) {
    super(route);
    this.paginationData.limit = 5;
  }

  readonly headers: DataTableHeader[] =  [
    { column: 'name', label: 'שם מחלקה' },
    { column: 'id', label: 'מספר מחלקה' }
  ];

  ngOnInit() {
    this.departmentService.getDepartments(this.selectUnit.currentEmployerID)
      .then(response => this.setItems(response));
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
