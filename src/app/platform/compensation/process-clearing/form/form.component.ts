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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<FormComponent>,
              private departmentService: DepartmentService,
              private compensationService: CompensationService,
              protected notificationService: NotificationService) { }

  ngOnInit() {
  }

  submit(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;
      form.value['event_code'] = '9302';
      form.value['employer_id'] = this.data.employerID;
      form.value['department_id'] = this.data.departmentId;
      this.compensationService.newCompensation(form.value).then(response => {
        this.message = response['message'];
        if (this.message === 'success') {
          this.dialogRef.close(true);
        } else {
          this.hasServerError = true;
          this.message = 'קימת בקשה למעסיק זה.';
        }
      });
    }
  }
}
