import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ProductService } from 'app/shared/_services/http/product.service';
import { ProductType } from 'app/shared/_models/product.model';
import { fade } from 'app/shared/_animations/animation';



@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styles: ['.inactive { display: none !important}'],
  animations: [ fade ],
})
export class FormComponent implements OnInit {

  employees = [];
  productTypes = [];
  productTypeLabels = ProductType;
  message: string;
  hasServerError: boolean;
  hasClearing = false;
  hasClearingEmployer = false;
  hasAllEmployer = false;

  scrollIndex = 1;
  companies = [];
  res: string;
  dateFilter = (date: Date) =>  (!this.hasClearingEmployer  ||
    (new Date(date.getFullYear() , date.getMonth() + 1 , 0).getDate() ===  date.getDate()))

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<FormComponent>,
              private departmentService: DepartmentService,
              private compensationService: CompensationService,
              protected notificationService: NotificationService,
              private productService: ProductService
               ) {}

  ngOnInit() {
    this.companies = this.data.companies;
    this.loadEmployees();
  }

  checkLoadEmployees(scrollY: number): void {
    if (scrollY >= 3700 * this.scrollIndex) {
      this.scrollIndex++;
      this.loadEmployees();
    }
  }

  loadEmployees(val?: string): void {
    this.departmentService.getEmployees(this.data.departmentId, val, this.scrollIndex)
    .then(response => {
      if (this.employees.length !== 0 && !val) {
        this.employees = [...this.employees, ...response];
      } else {
        // const first = [{'id': 0 , 'nameFull': 'כלל העובדים'}];
        // this.employees = [...first, ...response];
        this.employees = response;
      }
    });
   }

  loadProducts(companyID: number, employee_id: number): void {
    this.productTypes = [];
    this.productService.getProductByCompany(employee_id, companyID).then(types => {
      if (types.length === 0 || (types.length === 1 && types[0] === 'study' )) {
        this.productService.getProductTypesByCompany(companyID).then(typesAll => {
          for (const i in typesAll) {
            if (typesAll[i] !== 'study') {
              this.productTypes.push({id: typesAll[i], name: this.productTypeLabels[typesAll[i]]});
            }
          }
        });
      } else {
        for (const i in types) {
          if (types[i] !== 'study') {
            this.productTypes.push({id: types[i], name: this.productTypeLabels[types[i]]});
          }
        }
      }
    });
  }

  employeeCompany(employee_id: number): any {
    if (employee_id === 0) {
      this.hasAllEmployer = true;
      return;
    }
    this.hasAllEmployer = false;
    this.compensationService.getCompanyEmployee(employee_id).then(res => {
      if (res.length > 0) {
        this.data.companies = res;
      } else {
        this.data.companies = this.companies;
      }
    });
  }

  submit(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;
      if (this.hasClearingEmployer && this.data.employerID === 0) {
        this.notificationService.error('', 'יש לבחור מעסיק.');
      } else {
        // if (this.hasClearing && this.hasClearingEmployer) {
        //   form.value['company_id'] = '';
        // }
        // form.value['event_code'] = this.hasClearingEmployer ? '9302' : this.hasClearing ? '9303' : '9301';
        if (this.hasAllEmployer) {
          form.value['company_id'] = '';
        }
        form.value['event_code'] = this.hasAllEmployer ? '9300' : '9301';
        form.value['employer_id'] = this.data.employerID;
        form.value['department_id'] = this.data.departmentId;
        this.compensationService.newCompensation(form.value).then(response => {
          this.message = response['message'];
          if (this.message === 'success') {
            this.dialogRef.close(true);
          } else {
            this.hasServerError = true;
            this.message = 'קימת בקשה לעובד זה.';
          }
        });
      }
    }
  }

  filter(event: any, name: string) {
    if (name === 'employee') {
      this.scrollIndex = 1;
      this.loadEmployees(event);
    }
  }
}
