import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Employee } from '../../../../shared/_models/employee.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html'
})
export class EmployeeFormComponent {

  employee: Employee;

  isSubmitting: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EmployeeFormComponent>) {
    this.employee = data.employee;
    this.employee.employer = data.employer;
  }

  submit(isValid: boolean): void {
    if (isValid) {
      this.isSubmitting = true;
      setTimeout(() => this.dialogRef.close(this.employee), 2000);
    }
  }
}
