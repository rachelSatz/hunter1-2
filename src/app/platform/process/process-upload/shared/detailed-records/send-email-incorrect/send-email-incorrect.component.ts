import { Component, Inject, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MAT_DIALOG_DATA, MatChipInputEvent, MatDialogRef } from '@angular/material';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import {MonthlyTransferBlockService} from '../../../../../../shared/_services/http/monthly-transfer-block';

@Component({
  selector: 'app-send-email-incorrect',
  templateUrl: './send-email-incorrect.component.html',
})
export class SendEmailIncorrectComponent implements OnInit {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectable = true;
  removable = true;
  addOnBlur = true;
  emails: string[] = [];
  PAYMENTS_INSTRUCTIONS = 'payments_instructions';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public processService: ProcessService,
              public mtbService: MonthlyTransferBlockService,
              public contactService: ContactService,
              protected notificationService: NotificationService,
              private dialogRef: MatDialogRef<SendEmailIncorrectComponent>) { }

  ngOnInit() {
    this.contactService.getEmailEmployerContact( this.data.employerId).then(response =>
      this.emails = response
    );
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    const validEmailRegEx =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if ((value || '').trim()) {
      if (validEmailRegEx.test(value.trim())) {
        this.emails.push(value.trim());
      }
    }

    // Reset the input value
    if (input && validEmailRegEx.test(value.trim())) {
      input.value = '';
    }
  }

  remove(fruit): void {
    const index = this.emails.indexOf(fruit);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  sendMail(): void {
    if (this.emails !== null && this.emails.length > 0) {

      this.mtbService.sentEmailRecordIncorrect( this.data.processId,
        this.emails, this.data.criteria, this.data.files_list).then(response => {
        if (response === 'Ok') {
          this.notificationService.success('נשלח בהצלחה.');
          this.dialogRef.close();
        } else {
          this.notificationService.error('שליחה נכשלה');
        }
      });
    } else {
      this.notificationService.error('הוסף מייל');
    }
  }

}
