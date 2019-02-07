import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { ActivatedRoute } from '@angular/router';
import { DepartmentService } from 'app/shared/_services/http/department.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent extends DataTableComponent implements OnInit , OnDestroy {

  constructor(route: ActivatedRoute, private departmentService: DepartmentService) {
    super(route);
  }

  readonly headers: DataTableHeader[] =  [
    { column: 'name', label: 'שם מחלקה' },
    { column: 'id', label: 'מספר מחלקה' }
  ];

  ngOnInit() {
    this.departmentService.getDepartments(1).then(response => this.setItems(response));
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
