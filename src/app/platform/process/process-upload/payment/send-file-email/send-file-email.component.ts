import { Component, Inject, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatDialogRef } from '@angular/material';
import { Email} from '../../../../compensation/process/send-to/send-to.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ProcessService } from 'app/shared/_services/http/process.service';

@Component({
  selector: 'app-send-file-email',
  templateUrl: './send-file-email.component.html'
})
export class SendFileEmailComponent implements OnInit {
  fromEmail = 'desk@smarti.co.il';
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectable = true;
  removable = true;
  addOnBlur = true;
  Emails: Email[] = [];
  toEmail: Email;
  from = 'system';
  emailsList: string[] = [];
  formatData = {'sum': 2};

  constructor(public processService: ProcessService, protected notificationService: NotificationService,
              private dialogRef: MatDialogRef<SendFileEmailComponent>) { }

  ngOnInit() {
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    const validEmailRegEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // Add our fruit
    if ((value || '').trim()) {
      if (validEmailRegEx.test(value.trim())) {
        this.Emails.push({name: value.trim()});
      }
    }

    // Reset the input value
    if (input && validEmailRegEx.test(value.trim())) {
      input.value = '';
    }
  }

  remove(fruit: Email): void {
    const index = this.Emails.indexOf(fruit);

    if (index >= 0) {
      this.Emails.splice(index, 1);
    }
  }

  sendMail(): void {
    if (this.fromEmail !== 'desk@smarti.co.il') {
      this.from = 'user';
    }
    if (this.toEmail !== null) {
      this.emailsList.push(this.toEmail.toString());
    }
    if (this.Emails !== null && this.Emails.length > 0) {
      this.Emails.forEach(email => this.emailsList.push(email.name));
    }
    this.processService.sendEmail(this.from, this.emailsList, 'A', this.formatData).then( response => {
        if (response) {
          if (response['result'] === 'Message_Sent') {
            this.notificationService.success('נשלח בהצלחה.');
            this.dialogRef.close();
          } else {
            this.notificationService.error('שליחה נכשלה');
          }
        }
      });
  }
}
