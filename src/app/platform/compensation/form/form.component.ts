import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

import { DepartmentService } from 'app/shared/_services/http/department.service';
import { CompensationService } from 'app/shared/_services/http/compensation.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent {
  employees = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private departmentService: DepartmentService,
              private compensationService: CompensationService) {}

  loadEmployees(departmentID: number): void {
    this.departmentService.getEmployees(departmentID).then(response => this.employees = response);
  }

  submit(form: NgForm): void {
    if (form.valid) {
      this.compensationService.newCompensation(form.value).then(response => console.log(response));
    }
  }
}
