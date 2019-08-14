import { ActivatedRoute} from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatChipInputEvent, MatDialog, MatDialogRef } from '@angular/material';

import { fade } from 'app/shared/_animations/animation';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import { NotificationService } from 'app/shared/_services/notification.service';

@Component({
  selector: 'app-send-feedback',
  templateUrl: './send-feedback.component.html',
  animations: [ fade ]
})
export class SendFeedbackComponent implements OnInit {

  comment: string;
  emails: string[] = [];
  hasServerError: boolean;

  constructor(  private feedbackService: FeedbackService,
                private dialog: MatDialog,
                protected route: ActivatedRoute,
                public  notificationService: NotificationService,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<SendFeedbackComponent>) { }

  ngOnInit() {
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

  remove(email): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  submit(): void {
    if (this.emails !== null && this.emails.length > 0) {
      this.feedbackService.sendFeedback(
        this.data.ids,
        this.emails,
        this.comment).then(response => {

        const result = response.error['result'] === 'The mtb are not with the same process' ? 'התהליך אינו זהה' :
          response.error['result'] === 'email was not sent' ? 'המייל שגוי' : '';
        if (result !== '') {
          this.notificationService.error(result);
        } else {
          this.notificationService.success('נשלח בהצלחה');

        }
      });
    } else {
      this.notificationService.error('הוסף מייל');
    }
  }

  close(): void {
    this.dialogRef.close();
  }


}
