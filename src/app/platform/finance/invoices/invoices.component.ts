import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { EmployersFinanceExcelComponent } from './employers-finance-excel/employers-finance-excel.component';
import { ProactiveInvoiceFormComponent } from './proactive-invoice-form/proactive-invoice-form.component';
import {STATUS, ALL_STATUS, TYPES, ERROR_STATUS, Invoice} from 'app/shared/_models/invoice.model';
import { SelectUnitService} from 'app/shared/_services/select-unit.service';
import { RemarksFormComponent} from './remarks-form/remarks-form.component';
import { InvoiceService} from 'app/shared/_services/http/invoice.service';
import { HelpersService} from 'app/shared/_services/helpers.service';
import * as FileSaver from 'file-saver';
import { NotificationService } from 'app/shared/_services/notification.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { ManualInvoiceFormComponent } from './manual-invoice-form/manual-invoice-form.component';
import { PAYMENT_METHOD } from 'app/shared/_models/employer-financial-details.model';
import {TaxInvoiceFormComponent} from './tax-invoice-form/tax-invoice-form.component';
import {UserSessionService} from 'app/shared/_services/user-session.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', './invoices.component.css']
})
export class InvoicesComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  employers = [];
  // allEmployers = Object.keys(this.employers).map(function(e) {
  //   return { id: e, name: this.employers[e] };
  // });
  departments = [];
  invoices = [];
  // invoice_status = STATUS;
  status = Object.keys(STATUS).map(function(e) {
    return { id: e, name: STATUS[e] };
  });
  types = TYPES;
  // invoice_all_status = ALL_STATUS;
  // selectStatus = Object.keys(ALL_STATUS).map(function(e) {
  //   return { id: e, name: ALL_STATUS[e] };
  // });
  error_status = ERROR_STATUS;
  // error_status_items = Object.keys(ERROR_STATUS).map(function(e) {
  //   return { id: e, name: ERROR_STATUS[e] };
  // });
  sub = new Subscription;
  spin: boolean;

  paymentMethodItems = Object.keys(PAYMENT_METHOD).map(function(e) {
    return { id: e, name: PAYMENT_METHOD[e] };
  });
  permissionsType = this.userSession.getPermissionsType('finance');

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
    { name: 'options', label: 'אפשרויות' , searchable: false},
    { name: 'payment_method', label: 'אופן תשלום', searchOptions: { labels: this.paymentMethodItems }, isDisplay: false},
  ];

  constructor(route: ActivatedRoute,
              private invoiceService: InvoiceService,
              private selectUnit: SelectUnitService,
              private helpers: HelpersService,
              private dialog: MatDialog,
              protected notificationService: NotificationService,
              private employerService: EmployerService,
              private userSession: UserSessionService) {
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
    const dialog = this.dialog.open(ProactiveInvoiceFormComponent, {
      width: '450px'
    });
    this.sub.add(dialog.afterClosed().subscribe(() => {
      this.fetchItems();
    }));
  }

  openFinanceExcelDialog(): void {
    this.dialog.open(EmployersFinanceExcelComponent, {
      width: '450px',
      panelClass: 'employers-finance-excel'
    });
  }

  openManualInvoice(): void {
    const dialog = this.dialog.open(ManualInvoiceFormComponent, {
      width: '1100px'
    });

    this.sub.add(dialog.afterClosed().subscribe(() => {
      this.fetchItems();
    }));
  }

  openTaxInvoice(): void {
    if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
      this.dataTable.setNoneCheckedWarning();
      return;
    }
    const items = this.dataTable.criteria.isCheckAll ? this.dataTable.items : this.dataTable.criteria.checkedItems;
    const dialog = this.dialog.open(TaxInvoiceFormComponent, {
      data: {'ids': items.map(item => item['id'])},
      width: '450px'
    });

    this.sub.add(dialog.afterClosed().subscribe(() => {
      this.fetchItems();
    }));
  }

  sendTransactionInvoice():  void {
    if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
      this.dataTable.setNoneCheckedWarning();
      return;
    }
    const items = this.dataTable.criteria.isCheckAll ? this.dataTable.items : this.dataTable.criteria.checkedItems;
    const ids = items.map(item => item['id']);
    this.invoiceService.createTransactionInvoices(ids).then(response => {
      if (response['message'] !== 'success') {
        this.notificationService.error(response['message']);
      } else {
        this.notificationService.success('נשמר בהצלחה.');
      }
    });
  }



  downloadEmployeesExcel(invoiceId): void {
    this.invoiceService.downloadExcel(invoiceId).then(response => {
      if (response['message'] === 'no_employees') {
        this.notificationService.info('לא חויבו עובדים בחשבונית');
      } else if (response['message'] === 'error') {
        this.notificationService.error('ארעה שגיאה');
      } else if (response['message'] === 'establishing_invoice') {
        this.notificationService.info('חשבונית הקמה');
      } else {
        const byteCharacters = atob(response['message']['data']);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: 'application/' + 'xlsx'});
        const fileName = 'פירוט עובדים בחשבונית מספר - '  + invoiceId + '.xlsx';
        FileSaver.saveAs(blob, fileName);
        this.spin = false;
        this.notificationService.success('הקובץ הופק בהצלחה');
      }
    });
  }

  downloadInvoicesToExcel(): void {
    this.invoiceService.downloadInvoicesToExcel(this.dataTable.criteria).then(response => {
      if (response['message'] === 'error') {
        this.notificationService.error('לא ניתן להוריד את הקובץ');
      } else {
        const byteCharacters = atob(response['message']['data']);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: 'application/' + 'xlsx'});
        const fileName = 'חשבוניות-' + Date.now().toString() + '.xlsx';
        FileSaver.saveAs(blob, fileName);
        this.spin = false;
        this.notificationService.success('הקובץ הופק בהצלחה');
      }
    });
  }

  setInvoiceStatus(invoiceId: number, status: string): void {
    this.invoiceService.setInvoiceStatus(invoiceId, status).then(res =>
      this.notificationService.info(res['message']));
  }

  // deleteInvoices(): void {
  //   if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
  //     this.dataTable.setNoneCheckedWarning();
  //     return;
  //   }
  //   const items = this.dataTable.criteria.isCheckAll ? this.dataTable.items : this.dataTable.criteria.checkedItems;
  //
  //   this.invoiceService.deleteInvoices(items.map(
  //     item => item['id'])).then(response => {
  //     this.helpers.setPageSpinner(false);
  //     if (response) {
  //       if (response['message'] === 'success') {
  //         this.notificationService.success('הרשומות נמחקו בהצלחה.');
  //         this.dataTable.criteria.checkedItems = [];
  //         this.dataTable.criteria.isCheckAll = false;
  //         this.fetchItems();
  //       } else {
  //         this.notificationService.error('ארעה שגיאה.');
  //       }
  //     }
  //   });
  // }


  setItemTitle(item: Invoice): string {
    if (item.green_invoice_document !== null ) {
      if (item.green_invoice_document.errorDescription !== null && item.green_invoice_document.errorDescription !== '') {
        return item.green_invoice_document.errorDescription;
      } else {
        return '';
      }
    } else {
      return '';
    }


  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
