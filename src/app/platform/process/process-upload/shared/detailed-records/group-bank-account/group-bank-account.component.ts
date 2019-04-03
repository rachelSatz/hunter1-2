import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';
import { DataTableComponent } from 'app/shared/data-table-1/data-table.component';
import { fade } from 'app/shared/_animations/animation';
import {NotificationService} from '../../../../../../shared/_services/notification.service';

@Component({
  selector: 'app-group-bank-account',
  templateUrl: './group-bank-account.component.html',
  styleUrls: ['../../../../../../shared/data-table/data-table.component.css'],
  animations: [ fade ]
})
export class GroupBankAccountComponent implements OnInit , OnDestroy {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns =  [
    { name: 'bank', label: 'בנק' , searchable: false},
    { name: 'branch', label: 'סניף' , searchable: false},
    { name: 'account', label: 'מס חשבון' , searchable: false}
   ];

  constructor(protected route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<GroupBankAccountComponent>,
              public mtbService: MonthlyTransferBlockService) {
  }

  hasServerError: boolean;

  ngOnInit() {
    this.dataTable.setItems(this.data['banks']);
  }

  submit(form: NgForm): void {
    if (this.checkedRowItems()) {
      this.mtbService.createMTBGroup(this.data.ids,
        this.dataTable.criteria.checkedItems.map(item => item['id'])[0]).then(response => {
        if (response) {
          this.dialogRef.close();
        }
      });
    }
  }

  checkedRowItems(): boolean {
    if (this.dataTable.criteria.checkedItems.length === 0 || this.dataTable.criteria.checkedItems.length > 1) {
     this.hasServerError = true;
      return false;
    }
    return true;
  }

  ngOnDestroy() {
  }
}
