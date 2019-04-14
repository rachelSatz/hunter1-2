import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';

import { AppHttpService } from 'app/shared/_services/http/app-http.service';
import { NotificationService } from 'app/shared/_services/notification.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
  // styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private appHttp: AppHttpService,
              protected notificationService: NotificationService,
              private dialogRef: MatDialogRef<ForgotPasswordComponent>) { }

  ngOnInit() {
  }

  submit(form: NgForm): void {
    if (form.valid) {
      if (form.value.username) {
        this.appHttp.forgotPassword(form.value.username, form.value.email).then(
          response => {
            if (response['message'] === 'No User Found' || response['message'] !== 'Message_Sent') {
              this.notificationService.error(
                response['message'] === 'No User Found' ?
                    'השם משתמש או המייל שגוי' : 'קימת בעיה בשליחת המייל');
            }else {
              this.dialogRef.close();
            }
        });
      }
    }
  }
}
