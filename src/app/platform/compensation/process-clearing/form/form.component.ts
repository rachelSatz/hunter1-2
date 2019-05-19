import { NgForm } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { DepartmentService } from 'app/shared/_services/http/department.service';
import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  animations: [ fade ],
})
export class FormComponent implements OnInit {

  message: string;
  hasServerError: boolean;
  scrollIndex = 1;
  employees = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<FormComponent>,
              private departmentService: DepartmentService,
              private compensationService: CompensationService,
              protected notificationService: NotificationService) { }

  ngOnInit() {
    this.loadEmployees();

  }

  submit(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;
      form.value['event_code'] = form.value['employee'][0] === 0  ? '9302' : '9303';
      form.value['employer_id'] = this.data.employerID;
      form.value['department_id'] = this.data.departmentId;
      this.compensationService.newCompensation(form.value).then(response => {
        this.message = response['message'];
        if (this.message === 'success') {
          this.dialogRef.close(true);
        } else {
          this.hasServerError = true;
          if (this.message === 'finance error') {
            this.message = 'יש להגדיר מוצר פיננסי ע"מ ליצור בקשה מסוג זה';
          } else {
            this.message = 'קימת בקשה למעסיק זה.';
          }
        }
      });
    }
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
          const first = [{'id': 0 , 'nameFull': 'כלל העובדים'}];
          this.employees = [...first, ...response];
        }
      });
  }

  filter(event: any, name: string) {
    if (name === 'employee') {
      this.scrollIndex = 1;
      this.loadEmployees(event);
    }
  }
}
