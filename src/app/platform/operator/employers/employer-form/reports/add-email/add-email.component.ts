import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { Department, EmailDepartment } from 'app/shared/_models/department.model';
import { fade } from 'app/shared/_animations/animation';


@Component({
  selector: 'app-add-email',
  templateUrl: './add-email.component.html',
  animations: [ fade ],

})
export class AddEmailComponent implements OnInit {

  hasServerError: boolean;
  email_dep: EmailDepartment[];
  departments: Department[];
  email: string;
  department: number;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               private dialogRef: MatDialogRef<AddEmailComponent>,
               private departmentService: DepartmentService) { }

  ngOnInit() {
    this.departmentService.getEmailDepartment(this.data.employerId).then(response =>
      this.email_dep = response
    );
    this.departmentService.getDepartments(this.data.employerId)
      .then(response => this.departments = response['items']);
  }


  deleteEmail(id: number): void {
    this.departmentService.deleteEmail(id).then(response => {
      if (response) {
        this.dialogRef.close();
      } else {
        this.hasServerError = true;
      }

    });
  }


  submit(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;
      this.departmentService.addEmailDepartment(form.value).then(response => {
        if (response) {
          this.dialogRef.close();
        } else {

          this.hasServerError = true;
        }
      });
    }
  }

}
