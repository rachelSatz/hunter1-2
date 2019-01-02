import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataTableComponent } from '../../../../shared/data-table/data-table.component';
import { ActivatedRoute } from '@angular/router';
import { DataTableHeader } from '../../../../shared/data-table/classes/data-table-header';
import { AttachReferenceComponent } from './attach-reference/attach-reference.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-detailed-files',
  templateUrl: './detailed-files.component.html',
  styleUrls: ['./detailed-files.component.css']
})
export class DetailedFilesComponent extends DataTableComponent implements OnInit, OnDestroy {

  readonly headers: DataTableHeader[] =  [
    { column: 'group_id', label: 'מס קבוצה' }, { column: 'company', label: 'חברה מנהלת' },
    { column: 'product_pay', label: 'קופה בשכר' }, { column: 'product_type', label: 'סוג מוצר' },
    { column: 'product', label: 'מ"ה' }, { column: 'type_pay', label: 'סוג תשלום' },
    {column: 'account', label: 'מס חשבון/צק' }, { column: 'date_pay', label: 'תאריך תשלום' },
    { column: 'amount', label: 'סכום' }, { column: 'number', label: 'מספר מזהה' },
    { column: 'comment', label: 'הערות' }, { column: 'status', label: 'סטטוס' },
    { column: 'reference', label: 'אסמכתא' }
  ];

  constructor(route: ActivatedRoute, private dialog: MatDialog) {
    super(route);
  }

  ngOnInit() {
  }

  openDialogAttachReference(): void {
    this.dialog.open(AttachReferenceComponent, {
      width: '550px',
      panelClass: 'send-email-dialog'
    });
  }

}
