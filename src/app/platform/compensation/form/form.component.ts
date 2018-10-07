import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { DepartmentService } from 'app/shared/_services/http/department.service';
import { CompensationService } from 'app/shared/_services/http/compensation.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        opacity: '0'
      })),
      state('active', style({
        display: '*',
        opacity: '1'
      })),
      transition('active => inactive', animate('0ms')),
      transition('inactive => active', animate('200ms'))
    ])
  ]
})
export class FormComponent {

  employees = [];
  hasServerError: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<FormComponent>,
              private departmentService: DepartmentService, private compensationService: CompensationService) {}

  loadEmployees(departmentID: number): void {
    this.departmentService.getEmployees(departmentID).then(response => this.employees = response);
  }

  submit(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;

      this.compensationService.newCompensation(form.value).then(response => {
       if (response) {
         this.dialogRef.close(true);
       } else {
         this.hasServerError = true;
       }
      });
    }
  }
}
