import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import {PaymentType} from 'app/shared/_models/process.model';
import {NgForm} from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ProcessService} from '../../../../../../shared/_services/http/process.service';


@Component({
  selector: 'app-update-type-payment',
  templateUrl: './update-payment-type.component.html',
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        height: '0'
      })),
      state('active', style({
        display: '*',
        height: '*'
      })),
      transition('active => inactive', animate('200ms')),
      transition('inactive => active', animate('200ms'))
    ])
  ]
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
      console.log(this.type);
      this.processService.update('paymentType', this.type, this.data.file_id).then(response => {
        // if (response) {
          this.dialogRef.close();
        // }
      });
    }
  }
}


