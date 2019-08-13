import { Component, Inject, OnInit } from '@angular/core';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import { ActivatedRoute} from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-send-feedback',
  templateUrl: './send-feedback.component.html',
  styleUrls: ['./send-feedback.component.css']
})
export class SendFeedbackComponent implements OnInit {

  comment: string;

  constructor(  private feedbackService: FeedbackService,
                protected route: ActivatedRoute,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<SendFeedbackComponent>) { }

  ngOnInit() {
  }

  submit(): void {
    this.feedbackService.sendFeedback(
      this.data.ids,
      ['shoshi@smarti.co.il'] ,
      this.comment).then(response => {

      const result = response.error['result'] === 'The mtb are not with the same process' ? 'התהליך אינו זהה' :
        response.error['result'] === 'email was not sent' ? 'המייל שגוי' : '';
      if (result !== '') {
          this.notificationService.error(result);
        } else {
          this.notificationService.success('נשלח בהצלחה');

        }
    });
  }


}
