import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DepositType, EmployeeStatus } from 'app/shared/_models/monthly-transfer-block';
import { ProductType } from 'app/shared/_models/product.model';
import { ClauseType, FeedBackStatus } from 'app/shared/_models/transfer_clause.model';
import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';
import { NotificationService } from 'app/shared/_services/notification.service';
import * as FileSaver from 'file-saver';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';

@Component({
  selector: 'app-send-application',
  templateUrl: './send-application.component.html',
  styleUrls: ['./send-application.component.css']
})
export class SendApplicationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SendApplicationComponent>,
              public mtbService: MonthlyTransferBlockService,
              public notification: NotificationService,
              public feedbackService: FeedbackService,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  productType = ProductType;
  depositTypes = DepositType;
  employeeStatuses = EmployeeStatus;
  clause_types = ClauseType;
  feedBackStatus = FeedBackStatus;
  comment: string;

  ngOnInit() {
    this.comment = this.data.comment;
  }

  submit(): void {
    this.mtbService.saveComment( this.data.id, this.comment).then(response => {
        if (!response.ok) {
          this.notification.error('השמירה נכשלה');
        } else {
          this.data.comment = this.comment;
          this.close();
        }
      }
    );
  }

  downloadFile(groupThingId: number) {

    this.feedbackService.downloadGroupThingFile(groupThingId).then(response => {
      const fileName = response['fileName'];
      const byteCharacters = atob(response['blob']);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'application//pdf'});
      FileSaver.saveAs(blob, fileName);
    });
  }

  close() {
    this.dialogRef.close();
  }
}
