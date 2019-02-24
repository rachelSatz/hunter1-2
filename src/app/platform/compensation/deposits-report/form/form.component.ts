import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { DepositsReportService } from 'app/shared/_services/http/deposits-report.service';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { fade } from 'app/shared/_animations/animation';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  animations: [ fade ]
})
export class FormComponent implements OnInit {

  employees = [];
  scrollIndex = 1;
  hasServerError = false;
  hasClearingEmployer = false;
  message: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private depositsReportService: DepositsReportService,
              private dialogRef: MatDialogRef<FormComponent>,
              private departmentService: DepartmentService,
              protected notificationService: NotificationService,
              private helpers: HelpersService) { }

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
      this.helpers.setPageSpinner(true);
      this.hasServerError = false;
      this.depositsReportService.newDepositsReport(form.value).then(response => {
        this.helpers.setPageSpinner(false);
        if (response.ok) { this.dialogRef.close(true); }else {
          this.hasServerError = true;
          this.message = response['error']['message'];
       }});
    }
  }
}
