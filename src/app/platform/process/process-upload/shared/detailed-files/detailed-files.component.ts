import { Component, OnDestroy, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { AttachReferenceComponent } from './attach-reference/attach-reference.component';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ProcessStatus } from 'app/shared/_models/process.model';


@Component({
  selector: 'app-detailed-files',
  templateUrl: './detailed-files.component.html',
  styleUrls: ['../../../../../shared/data-table/data-table.component.css']
})
export class DetailedFilesComponent extends DataTableComponent implements OnInit, OnDestroy {

  readonly headers: DataTableHeader[] =  [
    { column: 'group_id', label: 'מס קבוצה' }, { column: 'company', label: 'חברה מנהלת' },
    { column: 'product_pay', label: 'קופה בשכר' }, { column: 'product_type', label: 'סוג מוצר' },
    { column: 'product', label: 'מ"ה' }, { column: 'type_pay', label: 'סוג תשלום' },
    { column: 'account', label: 'מס חשבון/צק' }, { column: 'date_pay', label: 'תאריך תשלום' },
    { column: 'amount', label: 'סכום' }, { column: 'number', label: 'מספר מזהה' },
    { column: 'comment', label: 'הערות' }, { column: 'status', label: 'סטטוס' },
    { column: 'file', label: 'קובץ' }
  ];

  constructor(route: ActivatedRoute,
              private dialog: MatDialog,
              private  processService: ProcessService) {
    super(route);
  }

  processStatus = ProcessStatus;

  ngOnInit() {
    this.processService.getFilesList(1).then( response => this.setItems(response));
  }

  openDialogAttachReference(): void {
    this.dialog.open(AttachReferenceComponent, {
      width: '550px',
      panelClass: 'send-email-dialog'
    });
  }

}
