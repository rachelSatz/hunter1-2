import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ProcessService } from 'app/shared/_services/http/process.service';
import { PaymentType } from 'app/shared/_models/process.model';
import { NgForm  } from '@angular/forms';
import { fade } from 'app/shared/_animations/animation';


@Component({
  selector: 'app-update-type-payment',
  templateUrl: './update-payment-type.component.html',
  animations: [ fade ]
})
export class UpdatePaymentTypeComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private  processService: ProcessService,
              private dialogRef: MatDialogRef<UpdatePaymentTypeComponent>) {
  }

  paymentType = PaymentType;
  type: any;
  paymentTypes = Object.keys(PaymentType).map(function (e) {
    return {id: e, name: PaymentType[e]};
  });

  ngOnInit() {
  }

  submit(form: NgForm): void {
    if (form.valid) {
      this.processService.update('paymentType', this.type,     this.data.file_id ).then(response => {
          this.dialogRef.close();
      });
    }
  }
}


