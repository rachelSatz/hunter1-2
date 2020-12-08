import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from '../../../../shared/data-table/data-table.component';
import { Subscription } from 'rxjs';
import { ERROR_STATUS, Invoice, STATUS, TYPES } from '../../../../shared/_models/invoice.model';
import { PAYMENT_METHOD } from '../../../../shared/_models/employer-financial-details.model';
import { ActivatedRoute } from '@angular/router';
import { UserSessionService } from '../../../../shared/_services/http/user-session.service';
import { MatDialog } from '@angular/material';
import { NotificationService } from '../../../../shared/_services/notification.service';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { InvoiceService } from '../../../../shared/_services/http/invoice.service';
import { EmployerService } from '../../../../shared/_services/http/employer.service';
import { InvoiceDetailsFormComponent } from './invoice-details-form/invoice-details-form.component';
import * as FileSaver from 'file-saver';
import { GeneralService } from '../../../../shared/_services/http/general.service';
import { SelectUnitService } from '../../../../shared/_services/select-unit.service';
import { ManualInvoiceFormComponent } from '../../../finance/invoices/manual-invoice-form/manual-invoice-form.component';
import { TaxInvoiceFormComponent } from '../../../finance/invoices/tax-invoice-form/tax-invoice-form.component';
import { TransactionInvoiceFormComponent } from '../../../finance/invoices/transaction-invoice-form/transaction-invoice-form.component';
import { TaxOnlyInvoiceFormComponent } from '../../../finance/invoices/tax-only-invoice-form/tax-only-invoice-form.component';
import { ReportsFormComponent } from '../../../finance/invoices/reports-form/reports-form.component';
import { RemarksFormComponent } from './remarks-form/remarks-form.component';
import {DataTableResponse} from '../../../../shared/data-table/classes/data-table-response';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css', '../../../../shared/data-table/data-table.component.css']
})
export class DocumentsComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  items: any;
  sub = new Subscription;
  types = TYPES;
  status = Object.keys(STATUS).map(function(e) {
    return { id: e, name: STATUS[e] };
  });
  paymentMethodItems = Object.keys(PAYMENT_METHOD).map(function(e) {
    return { id: e, name: PAYMENT_METHOD[e] };
  });
  error_status = Object.keys(ERROR_STATUS).map(function(e) {
    return { id: e, name: ERROR_STATUS[e] };
  });
  fileName = '';
  spin: boolean;
  permissionsType = this.userSession.getPermissionsType('employers');
  arrInvoicesTmp: any[];
  readonly columns  = [
    { name: 'employer_name', sortName: 'employer_financial_details__employer_relation__employer__name',
      label: 'שם מעסיק', searchable: false},
    { name: 'project_name' , searchable: false, label: 'שם פרויקט'},
    { name: 'green_invoice_number', sortName: 'green_invoice_document__number', label: 'מספר חשבונית בירוקה'},
    { name: 'total_amount', label: 'סכום'},
    { name: 'ids_count', label: 'כמות ת"ז' , searchable: false},
    { name: 'for_month', label: 'בגין חודש' , searchOptions: { isDate: true }},
    { name: 'created_at', label: 'ת.יצירה' , searchOptions: { isDate: true }},
    { name: 'last_payment_date', label: 'לתשלום עד ' , searchable: false},
    { name: 'kind', label: 'סוג חשבונית' , searchable: false},
    { name: 'status',  label: 'סטטוס', searchOptions: { labels: this.status } },
    { name: 'payment_method', label: 'אופן תשלום', searchOptions: { labels: this.paymentMethodItems }, isDisplay: false},
  ];

  constructor(public route: ActivatedRoute,
              private userSession: UserSessionService,
              private dialog: MatDialog,
              private notificationService: NotificationService,
              private helpers: HelpersService,
              private invoiceService: InvoiceService,
              private EmployerService: EmployerService,
              private GeneralService: GeneralService,
              private SelectUnitService: SelectUnitService) { }

  ngOnInit() {
    this.SelectUnitService.setActiveEmployerUrl('documents');
    this.fetchItems();
    this.GeneralService.getProjects(this.SelectUnitService.getProjectGroupId())
      .then(response => { this.GeneralService.projects = response['data'];
        this.columns['1'].searchOptions['labels'] = response['data']; });
  }
  fetchItems() {
    this.invoiceService.getEmployerInvoices(this.dataTable.criteria, this.SelectUnitService.currentEmployerID)
      .then(response => {
        this.dataTable.setItems(response);
        this.arrInvoicesTmp = response.items;
        this.helpers.setPageSpinner(false);
      });
  }
  showInvoiceDetails(item: Object): void {
    this.dialog.open(InvoiceDetailsFormComponent, {
      data: item,
      width: '750px'
    });
  }

  setInvoiceStatus(index: number, invoiceId: number, status: string): void {
      this.invoiceService.setInvoiceStatus(invoiceId, status).then(response => {
        if (response['message'] === 'success') {
          this.arrInvoicesTmp[invoiceId].status = status;
          this.notificationService.success('נשמר בהצלחה.');
        } else if ('no_changes') {
          this.notificationService.info('לא ניתן לשנות רשומה שנשלחה לחשבונית ירוקה');
        } else {
          this.notificationService.error(response['message']);
        }
      });
  }

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
  openManualInvoice(): void {
    this.dialog.open(ManualInvoiceFormComponent, {
      width: '1100px'
    });
  }
  openTaxInvoice(): void {
    if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
      this.dataTable.setNoneCheckedWarning();
      return;
    }
    const items =  this.dataTable.criteria.checkedItems.map(item => item['id']) ;

    const dialog = this.dialog.open(TaxInvoiceFormComponent, {
      data: {
        'ids': items,
        'dataTable' : this.dataTable
      },
      width: '450px'
    });

    this.sub.add(dialog.afterClosed().subscribe(() => {
      this.fetchItems();
      this.dataTable.criteria.checkedItems = [];
      this.dataTable.criteria.isCheckAll = false;
    }));
  }

  sendTransactionInvoice():  void {
    if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
      this.dataTable.setNoneCheckedWarning();
      return;
    }
    const items = this.dataTable.criteria.checkedItems.map(item => item['id']);

    const dialog = this.dialog.open(TransactionInvoiceFormComponent, {
      data: { 'ids': items,

        'dataTable' : this.dataTable},
      width: '450px'
    });

    this.sub.add(dialog.afterClosed().subscribe(res => {
      if (res) {
        this.dataTable.criteria.checkedItems = [];
        this.dataTable.criteria.isCheckAll = false;
        this.fetchItems();
      }
    }));
  }
  openOnlyTaxInvoice(): void {
    if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
      this.dataTable.setNoneCheckedWarning();
      return;
    }
    const items =  this.dataTable.criteria.checkedItems.map(item => item['id']) ;

    const dialog = this.dialog.open(TaxOnlyInvoiceFormComponent, {
      data: { 'ids': items,

        'dataTable' : this.dataTable},
      width: '450px'
    });

    this.sub.add(dialog.afterClosed().subscribe(() => {
      this.fetchItems();
      this.dataTable.criteria.checkedItems = [];
      this.dataTable.criteria.isCheckAll = false;
    }));
  }
  downloadInvoicesToExcel(): void {
    this.helpers.setPageSpinner(true);
    this.invoiceService.downloadInvoicesToExcel(this.dataTable.criteria).then(response => {
      this.helpers.setPageSpinner(false);
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
  openReports(): void {
    const dialog = this.dialog.open(ReportsFormComponent, {
      width: '450px'
    });
    this.sub.add(dialog.afterClosed().subscribe(() => {
      this.fetchItems();
    }));
  }
  //
  // downloadEmployeesExcel(invoiceId, item): void {
  //   this.invoiceService.downloadExcel(invoiceId).then(response => {
  //     if (response['message'] === 'no_employees') {
  //       this.notificationService.info('לא חויבו עובדים בחשבונית');
  //     } else if (response['message'] === 'error') {
  //       this.notificationService.error('ארעה שגיאה');
  //     } else if (response['message'] === 'establishing_invoice') {
  //       this.notificationService.info('חשבונית הקמה');
  //     } else {
  //       const byteCharacters = atob(response['message']['data']);
  //       const byteNumbers = new Array(byteCharacters.length);
  //       for (let i = 0; i < byteCharacters.length; i++) {
  //         byteNumbers[i] = byteCharacters.charCodeAt(i);
  //       }
  //       const byteArray = new Uint8Array(byteNumbers);
  //       const blob = new Blob([byteArray], {type: 'application/' + 'xlsx'});
  //       if (item.green_invoice_document !== null && item.green_invoice_document.number !== null
  //         && item.green_invoice_document.number !== '') {
  //         this.fileName = 'פירוט עובדים בחשבונית מספר - '  + item.green_invoice_document.number + '.xlsx';
  //       } else {
  //         this.fileName =  'פירוט עובדים בחשבונית'  + '.xlsx';
  //       }
  //       FileSaver.saveAs(blob, this.fileName);
  //       this.spin = false;
  //       this.notificationService.success('הקובץ הופק בהצלחה');
  //     }
  //   });
  // }

  ShowRemarks(item: Object): void {
    this.dialog.open(RemarksFormComponent, {
      data: item,
      width: '750px'
    });
  }
}
