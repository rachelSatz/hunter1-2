import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MonthlyTransferBlockService} from '../../../../../../shared/_services/http/monthly-transfer-block';

@Component({
  selector: 'app-group-bank-account',
  templateUrl: './group-bank-account.component.html'
})
export class GroupBankAccountComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<GroupBankAccountComponent>,
              public mtbService: MonthlyTransferBlockService) { }
  bankId: number;

  ngOnInit() {
  }

}
