import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DepositType, EmployeeStatus } from 'app/shared/_models/monthly-transfer-block';
import { ProductType } from 'app/shared/_models/product.model';
import { ClauseType, FeedBackStatus } from 'app/shared/_models/transfer_clause.model';

@Component({
  selector: 'app-send-application',
  templateUrl: './send-application.component.html',
  styleUrls: ['./send-application.component.css']
})
export class SendApplicationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SendApplicationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  productType = ProductType;
  depositTypes = DepositType;
  employeeStatuses = EmployeeStatus;
  clause_types = ClauseType;
  feedBackStatus = FeedBackStatus;

  ngOnInit() {
  }
}
