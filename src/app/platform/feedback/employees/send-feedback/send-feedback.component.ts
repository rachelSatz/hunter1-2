import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatChipInputEvent, MatDialog, MatDialogRef } from '@angular/material';

import { fade } from 'app/shared/_animations/animation';
<<<<<<< HEAD
import { FeedbackService } from '../../../../shared/_services/http/feedback.service';
import { NotificationService } from '../../../../shared/_services/notification.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
=======
import { HelpersService } from 'app/shared/_services/helpers.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

>>>>>>> 940fbd475ae1f54838714a35c8b86ff22c2212b0

@Component({
  selector: 'app-inquiry-form',
  templateUrl: './send-feedback.component.html',
  styleUrls: ['./send-feedback.component.css'],
  animations: [ fade ]
})
export class SendFeedbackComponent implements OnInit {
  hasServerError: boolean;
  comments = '';
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  emails: string[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<SendFeedbackComponent>,
              private contactService: ContactService,
              private helpers: HelpersService,
              private feedbackService: FeedbackService,
              private notificationService: NotificationService) { }

  ngOnInit() {
  }

  submit(): void {
    if (this.emails !== null && this.emails.length > 0) {
      this.feedbackService.sendFeedback(
        this.data.ids,
        this.emails,
        this.comments,
        this.data.criteria).then(response => {
        if (response['result'] !== 'yes') {
        const result = response.error['result'] === 'The mtb are not with the same process' ? 'התהליך אינו זהה' :
          response.error['result'] === 'email was not sent' ?  'המייל שגוי' :
            response.error['result'] ===  'no mtb' ?
            'אין פידבקים לשילחה' : '';

          this.notificationService.error(result);
        } else {
          this.close();
        }
      });
    } else {
      this.notificationService.error('הוסף מייל');
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const validEmailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if ((value || '').trim()) {
      if (validEmailRegEx.test(value.trim())) {
        this.emails.push(value.trim());
      }
    }

    if (input && validEmailRegEx.test(value.trim())) {
      input.value = '';
    }
  }

  remove(email): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
