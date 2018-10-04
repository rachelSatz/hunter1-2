import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { DepartmentService } from 'app/shared/_services/http/department.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  employees = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private departmentService: DepartmentService) {}

  loadEmployees(departmentID: number): void {
    this.departmentService.getEmployees(departmentID).then(response => this.employees = response);
  }
}
