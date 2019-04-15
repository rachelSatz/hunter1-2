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
  animations: [ fade ]
})
export class FormComponent implements OnInit {

  employees = [];
  productTypes = [];
  productTypeLabels = ProductType;
  message: string;
  hasServerError: boolean;
  hasClearing = false;
  hasClearingEmployer = false;
  scrollIndex = 1;

  dateFilter = (date: Date) =>  (!this.hasClearingEmployer  ||
    (new Date(date.getFullYear() , date.getMonth() + 1 , 0).getDate() ===  date.getDate()))

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<FormComponent>,
              private departmentService: DepartmentService, private compensationService: CompensationService,
              protected notificationService: NotificationService,
              private productService: ProductService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  checkLoadEmployees(scrollY: number): void {
    console.log(scrollY);
    if (scrollY >= 3700 * this.scrollIndex) {
      this.scrollIndex++;
      this.loadEmployees();
    }
  }

  loadEmployees(): void {
    this.departmentService.getEmployees(this.data.departmentId, this.scrollIndex)
    .then(response => {
      this.employees = [ ...this.employees, ...response];
    });
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
}
