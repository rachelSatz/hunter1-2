import { Component, OnInit, Inject } from '@angular/core';
import { FileFeedback } from "../../../shared/_models/file-feedback.model";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FeedbackService } from "../../../shared/_services/http/feedback.service";

@Component({
  selector: 'app-feedback-file-comment',
  templateUrl: './feedback-file-comment.component.html',
  styleUrls: ['./feedback-file-comment.component.css']
})
export class FeedbackFileCommentComponent implements OnInit {

  remark: string;

    constructor(@Inject(MAT_DIALOG_DATA) public fileFeedback: FileFeedback,private feedbackService: FeedbackService,
     public dialogRef: MatDialogRef<FeedbackFileCommentComponent>) {}

  ngOnInit() {
   
       this.remark = this.fileFeedback.remarkManual;
    
  }
  submit() {
    this.feedbackService.storeComment(this.fileFeedback, this.remark).then(response => this.dialogRef.close(response));
  }
}
