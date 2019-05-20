import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { DepositStatus, DepositType, EmployeeStatus } from 'app/shared/_models/monthly-transfer-block';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-edit-payments',
  templateUrl: './edit-payments.component.html',
})
export class EditPaymentsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  depositTypes = Object.keys(DepositType).map(function(e) {
    return { id: e, name: DepositType[e] };
  });

  depositStatus = Object.keys(DepositStatus).map(function(e) {
    return { id: e, name: DepositStatus[e] };
  });

  employeeStatus = Object.keys(EmployeeStatus).map(function(e) {
    return { id: e, name: EmployeeStatus[e] };
  });

  ngOnInit() {
  }

  submit(form: NgForm): void {

  }

}
