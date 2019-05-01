import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material';
import { Subscription} from 'rxjs';

import { EmployersFinanceExcelComponent} from './employers-finance-excel/employers-finance-excel.component';
import { ProactiveInvoiceFormComponent} from './proactive-invoice-form/proactive-invoice-form.component';
import { INVOICE_TYPES, STATUS, ALL_STATUS} from 'app/shared/_models/invoice.model';
import { SelectUnitService} from 'app/shared/_services/select-unit.service';
import { RemarksFormComponent} from './remarks-form/remarks-form.component';
import { InvoiceService} from 'app/shared/_services/http/invoice.service';
import { HelpersService} from 'app/shared/_services/helpers.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', './invoices.component.css']
})
export class InvoicesComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  employers = [];
  departments = [];
  invoices = [];
  invoice_status = STATUS;
  selectStatus = Object.keys(ALL_STATUS).map(function(e) {
    return { id: e, name: ALL_STATUS[e] };
  });
  invoice_all_status = ALL_STATUS;
  sub = new Subscription;
  spin: boolean;

  readonly columns  = [
    { name: 'employer_name', label: 'שם מעסיק', searchable: false },
    { name: 'green_invoice_number', label: 'מספר חשבונית בירוקה' , searchable: false},
    { name: 'amount', label: 'סכום' , searchable: false},
    { name: 'amount_ids', label: 'כמות ת"ז' , searchable: false},
    { name: 'for_month', label: 'בגין חודש' , searchable: false},
    { name: 'created_at', label: 'ת.יצירה' , searchable: false},
    { name: 'last_payment_date', label: 'לתשלום עד' , searchable: false},
    { name: 'kind', label: 'סוג חשבונית' , searchable: false},
    { name: 'status',  label: 'סטטוס', searchOptions: { labels: this.invoice_status } },
    { name: 'remark', label: 'הערות' , searchable: false},
    { name: 'options', label: 'אפשרויות' , searchable: false}
  ];

  constructor(route: ActivatedRoute,
              private invoiceService: InvoiceService,
              private selectUnit: SelectUnitService,
              private helpers: HelpersService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.fetchItems();
  }

  fetchItems() {
      this.invoiceService.getInvoices(this.dataTable.criteria).then(response => {
          this.dataTable.setItems(response) ;
        });
      }

  ShowRemarks(item: Object): void {
    this.dialog.open(RemarksFormComponent, {
      data: item,
      width: '750px'
    });
  }
  openProactiveInvoice(): void {
    this.dialog.open(ProactiveInvoiceFormComponent, {
      width: '450px'
    });
  }

  openFinanceExcelDialog(): void {
    this.dialog.open(EmployersFinanceExcelComponent, {
      width: '450px',
      panelClass: 'employers-finance-excel'
    });
  }

  downloadEmployeesExcel(invoice_id): void {
    this.invoiceService.downloadExcel(invoice_id).then(response => {
      const byteCharacters = atob(response['data']);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'application/' + 'xlsx'});
      const fileName = 'פירוט עובדים בחשבונית מספר - '  + invoice_id + '.xlsx';
      FileSaver.saveAs(blob, fileName);
      this.spin = false;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
