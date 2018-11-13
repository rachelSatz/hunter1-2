import { Component, OnInit } from '@angular/core';
import {DataTableComponent} from '../../../shared/data-table/data-table.component';
import {ActivatedRoute} from '@angular/router';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-invoices-error',
  templateUrl: './invoices-error.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', './invoices-error.component.css']
})
export class InvoicesErrorComponent extends DataTableComponent implements OnInit {

  readonly headers: DataTableHeader[] =  [
    { column: 'employer_name', label: 'מספר חשבונית' },
    { column: 'green_invoice_number', label: 'שם מעסיק' },
    { column: 'amount', label: 'סכום לפני מע"מ' },
    { column: 'amount_ids', label: 'כמות ת"ז' },
    { column: 'for_month', label: 'בגין חודש' },
    { column: 'created_at', label: 'ת.יצירה' },
    { column: 'type', label: 'סוג חשבונית' },
    { column: 'error_type', label: 'סוג שגיאה' },
    { column: 'options', label: 'אפשרויות' }
  ];

  constructor(route: ActivatedRoute) {super(route); }

  ngOnInit() {
  }

}
