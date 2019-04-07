import {  MAT_DIALOG_DATA, MatDatepickerModule, MatDialogRef } from '@angular/material';
import {  Component, Inject, OnInit } from '@angular/core';
import {  DatePipe } from '@angular/common';

import {  NotificationService } from 'app/shared/_services/notification.service';
import {  ProcessService } from 'app/shared/_services/http/process.service';

@Component({
  selector: 'app-date-update',
  templateUrl: './date-update.component.html',
  providers: [MatDatepickerModule]
})
export class DateUpdateComponent implements OnInit {
  date: string;


  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               private dialogRef: MatDialogRef<string>,
               private dataPipe: DatePipe,
               public notificationService: NotificationService,
               public  processService: ProcessService) { }

  ngOnInit() {
  }

  submit() {
    const paymentDate = this.dataPipe.transform(this.date, 'yyyy-MM-dd');
    this.processService.updateDepositDate(
      this.data.processID, paymentDate).then(response => {
      if (!response.result) {
        this.notificationService.error('', 'לא הצליח לעדכן תאריך');
      } else {
        this.dialogRef.close(paymentDate);
      }
    });

  }
}

