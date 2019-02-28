import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {MAT_DIALOG_DATA, MatChipInputEvent, MatDialogRef} from '@angular/material';
import { NotificationService } from 'app/shared/_services/notification.service';
import {Component, Inject, OnInit} from '@angular/core';
import { ProcessService } from 'app/shared/_services/http/process.service';

export interface Email {
  name: string;
}

@Component({
  selector: 'app-send-file-email',
  templateUrl: './send-file-email.component.html'
})
export class SendFileEmailComponent implements OnInit {
   readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectable = true;
  removable = true;
  addOnBlur = true;
  Emails: Email[] = [];
  emailsList: string[] = [];


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public processService: ProcessService,
              protected notificationService: NotificationService,
              private dialogRef: MatDialogRef<SendFileEmailComponent>) { }

  ngOnInit() {
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    const validEmailRegEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
    if (this.Emails !== null && this.Emails.length > 0) {
      this.Emails.forEach(email => this.emailsList.push(email.name));

      this.processService.sendEmail( this.data.processId, this.emailsList).then(response => {
        if (response) {
          if (response['result'] === 'Message_Sent') {
            this.notificationService.success('נשלח בהצלחה.');
            this.dialogRef.close();
          } else {
            this.notificationService.error('שליחה נכשלה');
          }
        }
      });
    } else {
      this.notificationService.error('הוסף מייל');
    }
  }

}
