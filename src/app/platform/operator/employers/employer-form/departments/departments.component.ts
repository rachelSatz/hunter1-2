import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';

import { DepartmentService } from 'app/shared/_services/http/department.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';


@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['../../../../../shared/data-table/data-table.component.css']
})
export class DepartmentsComponent implements OnInit  {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  constructor(route: ActivatedRoute,
              private departmentService: DepartmentService,
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
