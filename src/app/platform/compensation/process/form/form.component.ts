import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { DepartmentService } from 'app/shared/_services/http/department.service';
import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { ProductService } from 'app/shared/_services/http/product.service';

import { ProductType } from 'app/shared/_models/product.model';
import { NotificationService } from 'app/shared/_services/notification.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        opacity: 0
      })),
      state('active', style({
        display: '*',
        opacity: 1
      })),
      transition('active => inactive', animate('200ms')),
      transition('inactive => active', animate('200ms'))
    ])
  ]
})
export class FormComponent implements OnInit {

  employees = [];
  productTypes = [];
  productTypeLabels = ProductType;
  message: string;
  hasServerError: boolean;
  hasClearing = false;
  hasClearingEmployer = false;
  dateFilter = (date: Date) =>   (!this.hasClearingEmployer  ||
    (new Date(date.getFullYear() , date.getMonth() + 1 , 0).getDate() ===  date.getDate()))

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<FormComponent>,
              private departmentService: DepartmentService, private compensationService: CompensationService,
              protected notificationService: NotificationService,
              private productService: ProductService) {}

  ngOnInit() {

  }

  loadEmployees(departmentID: number): void {
    this.employees = this.data.departments.find( d => d.id === departmentID ).employees;
  }

  loadProducts(companyID: number): void {
    this.productTypes = [];
    this.productService.getProductTypesByCompany(companyID).then(types => {
      for (const i in types) {
        if (types[i] !== 'study') {
          this.productTypes.push({ id: types[i], name: this.productTypeLabels[types[i]] });
        }
      }
    });
  }

  submit(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;
      if (this.hasClearingEmployer && this.data.employerID === 0) {
        this.notificationService.error('', 'יש לבחור מעסיק.');
      } else {//
        if (this.hasClearing && this.hasClearingEmployer) {
          form.value['company_id'] = '';
        }
        form.value['event_code'] = this.hasClearingEmployer ? '9302' : this.hasClearing ? '9303' : '9301';
        form.value['employer_id'] = this.data.employerID;
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

  checkedEmployer(event: any): void {
      const c = event.checked;
      if (c && this.data.employerID === 0) {
        this.notificationService.error('', 'יש לבחור מעסיק.');
      }
  }
}
