import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { DepartmentService } from 'app/shared/_services/http/department.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { DepositsReportService } from 'app/shared/_services/http/deposits-report.service';



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
  scrollIndex = 1;
  hasServerError = false;
  hasClearingEmployer = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private depositsReportService: DepositsReportService,
              private dialogRef: MatDialogRef<FormComponent>,
              private departmentService: DepartmentService,
              protected notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.departmentService.getEmployees(this.data.departmentId, this.scrollIndex)
      .then(response => {
        this.employees = [ ...this.employees, ...response];
      });
  }

  checkLoadEmployees(scrollY: number): void {
    console.log(scrollY);
    if (scrollY >= 3700 * this.scrollIndex) {
      this.scrollIndex++;
      this.loadEmployees();
    }
  }

  submit(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;
      this.depositsReportService.newDepositsReport(form.value).then(response => {
        if (response) {
        this.dialogRef.close(true);
      }});
    }
  }
}
