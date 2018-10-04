import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { FormComponent } from './form/form.component';

import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { ProductService } from 'app/shared/_services/http/product.service';

import { ProductType } from 'app/shared/_models/product.model';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';

@Component({
  selector: 'app-compensation',
  templateUrl: './compensation.component.html',
  styleUrls: ['../../shared/data-table/data-table.component.css']
})
export class CompensationComponent extends DataTableComponent implements OnInit {

  employees = [];
  departments = [];
  companies = [];
  productTypes = Object.keys(ProductType).map(function(e) {
    return { id: e, name: ProductType[e] };
  });

  readonly headers: DataTableHeader[] =  [
    { column: 'createdAt', label: 'תאריך יצירת בקשה' }, { column: 'user', label: 'יוצר הבקשה' },
    { column: 'employer', label: 'מעסיק' }, { column: 'department', label: 'מחלקה' },
    { column: 'employee', label: 'עובד' }, { column: 'personalID', label: 'ת"ז' },
    { column: 'company', label: 'חברה מנהלת' }, { column: 'productType', label: 'סוג מוצר' },
    { column: 'validityDate', label: 'תאריך נכונות' }, { column: 'sentTo', label: 'מקור המידע' },
    { column: 'status', label: 'סטטוס' }, { column: null, label: 'העבר לטיפול' },
    { column: null, label: 'הערות' }, { column: null, label: 'הורדה' },
    { column: null, label: 'פרטים' }, { column: null, label: 'פניות' },
    { column: 'validity', label: 'תקינות' }
  ];

  constructor(protected route: ActivatedRoute, private compensationService: CompensationService,
              private dialog: MatDialog, private departmentService: DepartmentService,
              private productService: ProductService) {
    super(route);
  }

  ngOnInit() {
    this.departmentService.getDepartments().then(response => this.departments = response);
    this.productService.getCompanies().then(response => this.companies = response);
    super.ngOnInit();
  }

  fetchItems(): void {
    this.compensationService.getCompensations().then(response => this.setItems(response));
  }

  loadEmployees(departmentID: number): void {
    this.departmentService.getEmployees(departmentID).then(response => this.employees = response);
  }

  openFormDialog(): void {
    this.dialog.open(FormComponent, {
      data: { companies: this.companies, departments: this.departments }
    });
  }

}
