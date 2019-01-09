import { Component, Inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';
import { formatDate } from '@angular/common';
import { ProcessService } from 'app/shared/_services/http/process.service';

@Component({
  selector: 'app-update-payment-date',
  templateUrl: './update-payment-date.component.html'
})
export class UpdatePaymentDateComponent implements OnInit {

  date: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private  processService: ProcessService,
              private dialogRef: MatDialogRef<UpdatePaymentDateComponent>,
              public datepipe: DatePipe) { }

  ngOnInit() {
  }


  submit(form: NgForm): void {
    if (form.valid) {
      const dateFormat = this.datepipe.transform(this.date, 'yyyy-MM-dd');

      this.processService.update('date', dateFormat, this.data.file_id).then( response => {
        // if (response) {
          this.dialogRef.close();
        // }
      });
    }
  }
}
