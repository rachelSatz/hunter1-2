import { Component, Inject, OnInit } from '@angular/core';
import { ManualStatus } from 'app/shared/_models/employee-feedback.model';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.css']
})
export class ChangeStatusComponent implements OnInit {

  manualStatus = Object.keys(ManualStatus).map(function(e) {
    return { id: e, name: ManualStatus[e] };
  });
  status: string;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               private dialogRef: MatDialogRef<ChangeStatusComponent>,
               private feedbackService: FeedbackService) { }

  ngOnInit() {
  }

  submit(): void {
    if (this.status !== undefined) {
      this.feedbackService.changeStatus(this.data.ids, this.data.contentType, this.status, this.data.criteria).then(res => {
        this.dialogRef.close(true);
      });
    }

  }

}
