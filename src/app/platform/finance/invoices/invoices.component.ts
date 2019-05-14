import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Subscription} from 'rxjs';

import { EmployersFinanceExcelComponent} from './employers-finance-excel/employers-finance-excel.component';
import { ProactiveInvoiceFormComponent} from './proactive-invoice-form/proactive-invoice-form.component';
import { STATUS, ALL_STATUS} from 'app/shared/_models/invoice.model';
import { SelectUnitService} from 'app/shared/_services/select-unit.service';
import { RemarksFormComponent} from './remarks-form/remarks-form.component';
import { InvoiceService} from 'app/shared/_services/http/invoice.service';
import { HelpersService} from 'app/shared/_services/helpers.service';
import * as FileSaver from 'file-saver';
import { NotificationService } from '../../../shared/_services/notification.service';
import { EmployerService } from '../../../shared/_services/http/employer.service';
import { ManualInvoiceFormComponent } from './manual-invoice-form/manual-invoice-form.component';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', './invoices.component.css']
})
export class InvoicesComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  employers = [];
  allEmployers = Object.keys(this.employers).map(function(e) {
    return { id: e, name: this.employers[e] };
  });
  departments = [];
  invoices = [];
  invoice_status = STATUS;
  status = Object.keys(STATUS).map(function(e) {
    return { id: e, name: STATUS[e] };
  });
  invoice_all_status = ALL_STATUS;
  selectStatus = Object.keys(ALL_STATUS).map(function(e) {
    return { id: e, name: ALL_STATUS[e] };
  });
  sub = new Subscription;
  spin: boolean;

  readonly columns  = [
    { name: 'employer_name', label: 'שם מעסיק', searchable: false},
    { name: 'green_invoice_number', label: 'מספר חשבונית בירוקה'},
    { name: 'amount', label: 'סכום'},
    { name: 'amount_ids', label: 'כמות ת"ז' , searchable: false},
    { name: 'for_month', label: 'בגין חודש' , searchOptions: { isDate: true }},
    { name: 'created_at', label: 'ת.יצירה' , searchOptions: { isDate: true }},
    { name: 'last_payment_date', label: 'לתשלום עד' , searchable: false},
    { name: 'kind', label: 'סוג חשבונית' , searchable: false},
    { name: 'status',  label: 'סטטוס', searchOptions: { labels: this.status } },
    { name: 'remark', label: 'הערות' , searchable: false},
    { name: 'options', label: 'אפשרויות' , searchable: false}
  ];

  constructor(route: ActivatedRoute,
              private invoiceService: InvoiceService,
              private selectUnit: SelectUnitService,
              private helpers: HelpersService,
              private dialog: MatDialog,
              protected notificationService: NotificationService,
              private employerService: EmployerService) {
  }

  ngOnInit() {
    this.employerService.getAllEmployers(null, true).then(
      response => this.employers = response['items']);
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

  openManualInvoice(): void {
    this.dialog.open(ManualInvoiceFormComponent, {
      width: '950px'
    });
  }

  downloadEmployeesExcel(invoiceId): void {
    this.invoiceService.downloadExcel(invoiceId).then(response => {
      const byteCharacters = atob(response['data']);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'application/' + 'xlsx'});
      const fileName = 'פירוט עובדים בחשבונית מספר - '  + invoiceId + '.xlsx';
      FileSaver.saveAs(blob, fileName);
      this.spin = false;
    });
  }

  setInvoiceStatus(invoiceId: number, status: string): void {
    this.invoiceService.setInvoiceStatus(invoiceId, status).then(res =>
      this.notificationService.info(res['message']));
  }

  deleteInvoices(): void {
    if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
      this.dataTable.setNoneCheckedWarning();
      return;
    }
    this.invoiceService.deleteInvoices(this.dataTable.criteria.checkedItems.map(
      item => item['id'])).then(response => {
      this.helpers.setPageSpinner(false);
      if (response) {
        if (response['message'] === 'success') {
          this.notificationService.success('הרשומות נמחקו בהצלחה.');
          this.dataTable.criteria.checkedItems = [];
          this.dataTable.criteria.isCheckAll = false;
          this.fetchItems();
        } else {
          this.notificationService.error('ארעה שגיאה.');
        }
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
