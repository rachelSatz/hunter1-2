import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DepositType, EmployeeStatus } from 'app/shared/_models/monthly-transfer-block';
import { ProductType } from 'app/shared/_models/product.model';
import { ClauseType, FeedBackStatus } from 'app/shared/_models/transfer_clause.model';
import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';
import { NotificationService } from 'app/shared/_services/notification.service';

@Component({
  selector: 'app-send-application',
  templateUrl: './send-application.component.html',
  styleUrls: ['./send-application.component.css']
})
export class SendApplicationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SendApplicationComponent>,
              public mtbService: MonthlyTransferBlockService,
              public notification: NotificationService,
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

  close() {
    this.dialogRef.close();
  }
}
