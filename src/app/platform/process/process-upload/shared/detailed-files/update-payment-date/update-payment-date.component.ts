import { Component, Inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';
import { ProcessService } from 'app/shared/_services/http/process.service';
import {NotificationService} from '../../../../../../shared/_services/notification.service';

@Component({
  selector: 'app-update-payment-date',
  templateUrl: './update-payment-date.component.html'
})
export class UpdatePaymentDateComponent implements OnInit {

  date: any;
  displayDate = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private  processService: ProcessService,
              private dialogRef: MatDialogRef<UpdatePaymentDateComponent>,
              public datePipe: DatePipe,
              private notificationService: NotificationService) { }

  ngOnInit() {
    this.displayDate = this.data.date !== undefined && (this.data.date).toString() !== '';
  }

  submit(form: NgForm): void {
    if (form.valid) {
      const dateFormat = this.datePipe.transform(this.date, 'yyyy-MM-dd');
      this.processService.update('date', dateFormat,  this.data.file_id, this.data.dataTable).then( response => {
          this.dialogRef.close();
        if (response) {
          this.notificationService.success('העידכון בוצע בהצלחה');
        } else {
          this.notificationService.error('העידכון נכשל');
        }
      });
    }
  }
}
