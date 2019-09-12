import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';

import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import { Status } from 'app/shared/_models/file-feedback.model';
import { ProductType } from 'app/shared/_models/product.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  sub = new Subscription();
  fileName: string;
  spin: boolean;
  productType = ProductType;
  statuses = Status;
  error: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<FormComponent>,
              private feedbackService: FeedbackService) { }

  ngOnInit() {
    const feedback = this.data.group_thing_feedback[0];
    const status_handling = feedback  ? feedback.status_handling_funds : '';

    this.error =  feedback  ? feedback.handling_status
      + ' ' + this.data.error_details
      + (status_handling === null || feedback.handling_status.includes(status_handling)
        ? '' : ' ' + feedback.status_handling_funds ) :  this.data.error_details;
  }

  downloadFile(id: number) {

    this.feedbackService.downloadGroupThingFile(id).then(response => {
      const fileName = response['fileName'];
      const byteCharacters = atob(response['blob']);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'application//pdf'});
      FileSaver.saveAs(blob, fileName);
      this.spin = false;
    });
  }

  close() {
    this.dialogRef.close();
  }
}
