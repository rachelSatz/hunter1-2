import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ProcessService } from '../../../../shared/_services/http/process.service';

@Component({
  selector: 'app-transmission-comment',
  templateUrl: './transmission-comment.component.html',
  styleUrls: ['./transmission-comment.component.css']
})
export class TransmissionCommentComponent implements OnInit {

  remark: string;

  constructor(@Inject(MAT_DIALOG_DATA) public payment: any, private processService: ProcessService,
              public dialogRef: MatDialogRef<TransmissionCommentComponent>) {}

  ngOnInit() {
    if (this.payment.file.remark) {
      this.remark = this.payment.file.remark;
    }
  }

  submit() {
    
    this.processService.storeComment(this.payment, this.remark).then(response => this.dialogRef.close(response));
  }
}
