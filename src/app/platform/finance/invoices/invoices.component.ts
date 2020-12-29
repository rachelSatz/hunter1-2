import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ERROR_STATUS, Invoice, STATUS, TYPES } from '../../../shared/_models/invoice.model';
import { PAYMENT_METHOD } from '../../../shared/_models/employer-financial-details.model';
import { UserSessionService } from '../../../shared/_services/http/user-session.service';
import { MatDialog } from '@angular/material';
import { ManualInvoiceFormComponent } from './manual-invoice-form/manual-invoice-form.component';
import { Subscription } from 'rxjs';
import { TaxInvoiceFormComponent } from './tax-invoice-form/tax-invoice-form.component';
import { TransactionInvoiceFormComponent } from './transaction-invoice-form/transaction-invoice-form.component';
import { TaxOnlyInvoiceFormComponent } from './tax-only-invoice-form/tax-only-invoice-form.component';
import { NotificationService } from '../../../shared/_services/notification.service';
import { HelpersService } from '../../../shared/_services/helpers.service';
import { ReportsFormComponent } from './reports-form/reports-form.component';
import { InvoiceService } from '../../../shared/_services/http/invoice.service';
import { GeneralService } from '../../../shared/_services/http/general.service';
import { SelectUnitService } from '../../../shared/_services/select-unit.service';
import { Project } from '../../../shared/_models/project.model';
import { InvoiceDetailsFormComponent } from './invoice-details-form/invoice-details-form.component';
import * as FileSaver from 'file-saver';
import { RemarksFormComponent } from './remarks-form/remarks-form.component';
import { ProactiveInvoiceFormComponent } from './proactive-invoice-form/proactive-invoice-form.component';
import {CreditCardExelComponent} from './credit-card-exel/credit-card-exel.component';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css', '../../../shared/data-table/data-table.component.css']
})
export class InvoicesComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  items: any;
  tax: boolean;
  sub = new Subscription;
  types = TYPES;
  projects: Project[] = [];
  status = Object.keys(STATUS).map(function (e) {
    return {id: e, name: STATUS[e]};
  });
  paymentMethodItems = Object.keys(PAYMENT_METHOD).map(function (e) {
    return {id: e, name: PAYMENT_METHOD[e]};
  });
  spin: boolean;
  error_status = Object.keys(ERROR_STATUS).map(function (e) {
    return {id: e, name: ERROR_STATUS[e]};
  });
  filters = {};
  permissionsType = this.userSession.getPermissionsType('finance');
  invoices = [];
  is_valid: boolean;
  ids_projects_group1 = [1, 4, 5, 6, 14];
  ids_projects_group2 = [2];
  group1: boolean;
  group2: boolean;
  readonly columns = [
    {
      name: 'employer_name', sortName: 'employer_financial_details__employer_relation__employer__name',
      label: 'שם מעסיק', searchable: false
    },
    {
      name: 'project_name', sortName: 'project__project_name', label: 'שם פרויקט',
      searchOptions: {labels: this.GeneralService.projects}, multiple: true
    },
    {name: 'green_invoice_number', sortName: 'green_invoice_document__number', label: 'מספר חשבונית בירוקה'},
    {name: 'total_amount', label: 'סכום'},
    {name: 'ids_count', label: 'כמות ת"ז', searchable: false},
    {name: 'for_month', label: 'בגין חודש', searchOptions: {isDate: true}},
    {name: 'created_at', label: 'ת.יצירה', searchOptions: {isDate: true}},
    {name: 'last_payment_date', label: 'לתשלום עד', searchable: false},
    {name: 'type', label: 'סוג חשבונית', searchable: false},
    {name: 'status', label: 'סטטוס', searchOptions: {labels: this.status}, multiple: true},
    {name: 'payment_method', label: 'אופן תשלום', searchOptions: {labels: this.paymentMethodItems}, isDisplay: false},
    {name: 'project_group_id', label: 'פרויקט על', isDisplay: false, searchable: false},
    {name: 'organization_id', label: 'ארגון', isDisplay: false, searchable: false},
    {name: 'employer_id', label: 'מעסיק', isDisplay: false, searchable: false}
  ];


  constructor(public route: ActivatedRoute,
              private userSession: UserSessionService,
              private dialog: MatDialog,
              private router: Router,
              private notificationService: NotificationService,
              private helpers: HelpersService,
              private invoiceService: InvoiceService,
              private GeneralService: GeneralService,
              private selectUnit: SelectUnitService) {
  }

  ngOnInit() {
    this.selectUnit.setActiveUrl('finance');
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
      this.fetchItems();
    }));
    this.fetchItems();
  }

  setItemTitle(item: Invoice): string {
    if (item.green_invoice_document !== null) {
      if (item.green_invoice_document.errorDescription !== null && item.green_invoice_document.errorDescription !== '') {
        return item.green_invoice_document.errorDescription;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  setInvoiceStatus(invoiceId: number, status: string): void {
    this.invoiceService.setInvoiceStatus(invoiceId, status).then(response => {
      this.helpers.setPageSpinner(false);
      if (response['message'] === 'success') {
        this.notificationService.success('נשמר בהצלחה.');
      } else if ('no_changes') {
        this.notificationService.info('לא ניתן לשנות רשומה שנשלחה לחשבונית ירוקה');
        this.ngOnInit();
      } else {
        this.notificationService.error(response['message']);
      }
    });
  }

  fetchItems() {
    this.GeneralService.getProjects(this.selectUnit.getProjectGroupId())
      .then(response => {
        this.GeneralService.projects = response['data'];
        this.columns[1]['searchOptions'].labels = response['data'];
      });
    this.sub = this.route.params.subscribe(v => {
      this.setFilters(v);
    });
    this.helpers.setPageSpinner(true);
    if (this.filters['created_at[from]']) {
      this.dataTable.criteria.filters = this.filters;
    }
    this.invoiceService.getInvoices(this.dataTable.criteria)
      .then(response => {
        console.log(response);
        this.dataTable.setItems(response);
        this.helpers.setPageSpinner(false);
      });
  }

  setFilters(conditions): void {
    if (conditions['from_date']) {
      if (conditions['project_id'] !== '0') {
        this.filters['project_name'] = +conditions['project_id'];
      }
      if (conditions['product_type'] !== 'all') {
        this.filters['product_type'] = conditions['product_type'];
      }
      if (conditions['project_group_id']) {
        this.filters['project_group_id'] = +conditions['project_group_id'];
      }
      if (conditions['organization_id'] !== 0 && conditions['organization_id'] !== '0' && conditions['organization_id']) {
        this.filters['organization_id'] = +conditions['organization_id'];
      }
      if (conditions['employer_id'] !== 0 && conditions['employer_id'] !== '0' && conditions['employer_id']) {
        this.filters['employer_id'] = +conditions['employer_id'];
      }
      this.filters['status'] = conditions['status'];
      this.filters['created_at[from]'] = conditions['from_date'];
      this.filters['created_at[to]'] = conditions['to_date'];
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
    const items = this.dataTable.criteria.checkedItems.map(item => item['id']);
    const dialog = this.dialog.open(TaxInvoiceFormComponent, {
      data: {
        'ids': items,
        'dataTable': this.dataTable
      },
      width: '450px'
    });
    this.sub.add(dialog.afterClosed().subscribe(() => {
      this.fetchItems();
      this.dataTable.criteria.checkedItems = [];
      this.dataTable.criteria.isCheckAll = false;
    }));
  }

  sendTransactionInvoice(): void {
    if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
      this.dataTable.setNoneCheckedWarning();
      return;
    }
    const items = this.dataTable.criteria.checkedItems.map(item => item['id']);
    const dialog = this.dialog.open(TransactionInvoiceFormComponent, {
      data: {'ids': items, 'dataTable': this.dataTable},
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
    if (this.dataTable.criteria .checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
      this.dataTable.setNoneCheckedWarning();
      return;
    }
    const items = this.dataTable.criteria.checkedItems.map(item => item['id']);
    const dialog = this.dialog.open(TaxOnlyInvoiceFormComponent, {
      data: {'ids': items, 'dataTable': this.dataTable},
      width: '450px'
  })
    ;
    this.sub.add(dialog.afterClosed().subscribe(() => {
      this.fetchItems();
      this.dataTable.criteria.checkedItems = [];
      this.dataTable.criteria.isCheckAll = false;
    }));
  }

  downloadInvoicesToExcel(): void {
    if (this.dataTable.criteria.checkedItems.length > 0 || this.dataTable.criteria.isCheckAll) {
      const items = this.dataTable.criteria.checkedItems.map(item => item['id']);
    }
    console.log(this.items);
    console.log(this.dataTable.criteria);
    this.helpers.setPageSpinner(true);
    this.invoiceService.downloadInvoicesToExcel(this.dataTable.criteria).then(response => {
      this.helpers.setPageSpinner(false);
      if (response['message'] === 'error') {
        this.notificationService.error('לא ניתן להוריד את הקובץ');
      } else {
        if (response['message'] === 'no_data') {
          this.notificationService.warning('אין נתונים להורדה');
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

  showInvoiceDetails(item: Object): void {
    this.dialog.open(InvoiceDetailsFormComponent, {
      data: item,
      width: '750px'
    });
  }

  downloadEmployeesExcel(invoiceId, item): void {
    this.invoiceService.downloadExcel(invoiceId).then(response => {
      if (response['message'] === 'no_employees') {
        this.notificationService.info('לא חויבו עובדים בחשבונית');
      } else {
        const byteCharacters = atob(response['message']['data']);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: 'application/' + 'xlsx'});
        const fileName = 'פירוט עובדים בחשבוניות-' + Date.now().toString() + '.xlsx';
        FileSaver.saveAs(blob, fileName);
        this.spin = false;
        this.notificationService.success('הקובץ הופק בהצלחה');
      }
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
      width: '500px',
      height: '600px'
  })
    ;
    this.sub.add(dialog.afterClosed().subscribe(() => {
      this.fetchItems();
    }));
  }

  createMasav(): boolean {
    if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
      this.dataTable.setNoneCheckedWarning();
      return false;
    }
  }

  openCreditCardInvoices(): void {
    const dialog = this.dialog.open(CreditCardExelComponent, {
      width: '450px'
    });
    this.sub.add(dialog.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.tax = result;
        this.downloadCreditCardInvoices();
      } else {
        console.log(result);
        this.notificationService.error('לא ניתן להוריד את הקובץ');
      }
    }));
  }

  downloadCreditCardInvoices(): void {
    this.invoiceService.downloadCreditCardInvoicesToExcel(this.dataTable.criteria, this.tax).then(response => {
      if (response['message'] === 'error') {
        this.notificationService.error('לא ניתן להוריד את הקובץ');
      } else {
        if (response['message'] === 'no_data') {
          this.notificationService.warning('אין נתונים להורדה');
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

      }
    });
  }
}
