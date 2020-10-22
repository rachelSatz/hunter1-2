import { Component, OnInit,ViewChild } from '@angular/core';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { ActivatedRoute } from '@angular/router';
import {ERROR_STATUS, Invoice, STATUS, TYPES} from '../../../shared/_models/invoice.model';
import { PAYMENT_METHOD } from '../../../shared/_models/employer-financial-details.model';
import { UserSessionService } from '../../../shared/_services/http/user-session.service';
import { DataTableResponse } from '../../../shared/data-table/classes/data-table-response';
import { MatDialog } from '@angular/material';
import { EmployersFinanceExcelComponent } from './employers-finance-excel/employers-finance-excel.component';
import { ManualInvoiceFormComponent } from './manual-invoice-form/manual-invoice-form.component';
import { Subscription } from 'rxjs';
import { TaxInvoiceFormComponent } from './tax-invoice-form/tax-invoice-form.component';
import { TransactionInvoiceFormComponent } from './transaction-invoice-form/transaction-invoice-form.component';
import { TaxOnlyInvoiceFormComponent } from './tax-only-invoice-form/tax-only-invoice-form.component';
import { NotificationService } from '../../../shared/_services/notification.service';
import { HelpersService } from '../../../shared/_services/helpers.service';
import { ReportsFormComponent } from './reports-form/reports-form.component';
import { InvoiceService } from '../../../shared/_services/http/invoice.service';
import {GeneralService} from '../../../shared/_services/http/general.service';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';
import {Project} from '../../../shared/_models/project.model';
import {InvoiceDetailsFormComponent} from './invoice-details-form/invoice-details-form.component';
import * as FileSaver from 'file-saver';
import {RemarksFormComponent} from './remarks-form/remarks-form.component';
import {PlatformComponent} from '../../platform.component';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css','../../../shared/data-table/data-table.component.css']
})
export class InvoicesComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  items: any;
  sub = new Subscription;
  types = TYPES;
  projects: Project[]=[];
  status = Object.keys(STATUS).map(function(e) {
    return { id: e, name: STATUS[e] };
  });
  paymentMethodItems = Object.keys(PAYMENT_METHOD).map(function(e) {
    return { id: e, name: PAYMENT_METHOD[e] };
  });
  fileName = '';
  spin: boolean;
  error_status = Object.keys(ERROR_STATUS).map(function(e) {
    return { id: e, name: ERROR_STATUS[e] };
  });
  filters = {}
  readonly columns  = [
    { name: 'employer_name', sortName: 'employer_financial_details__employer_relation__employer__name', label: 'שם מעסיק', searchable: false},
    { name: 'project_name', sortName:'project__project_name', label: 'שם פרויקט', searchOptions: { labels: this.GeneralService.projects} },
    { name: 'green_invoice_number', sortName:'green_invoice_document__number', label: 'מספר חשבונית בירוקה'},
    { name: 'total_amount', label: 'סכום'},
    { name: 'ids_count', label: 'כמות ת"ז' , searchable: false},
    { name: 'for_month', label: 'בגין חודש' , searchOptions: { isDate: true }},
    { name: 'created_at', label: 'ת.יצירה' , searchOptions: { isDate: true }},
    { name: 'last_payment_date', label: 'לתשלום עד' , searchable: false},
    { name: 'type', label: 'סוג חשבונית' , searchable: false},
    { name: 'status',  label: 'סטטוס', searchOptions: { labels: this.status } , multiple: true},
    { name: 'remark', label: 'הערות' , searchable: false},
    { name: 'options', label: 'אפשרויות' , searchable: false},
    { name: 'details', label: 'פירוט' , searchable: false},
    { name: 'payment_method', label: 'אופן תשלום', searchOptions: { labels: this.paymentMethodItems }, isDisplay: false},
  ];
  constructor(public route:ActivatedRoute,
              private userSession: UserSessionService,
              private dialog: MatDialog,
              private notificationService:NotificationService,
              private helpers:HelpersService,
              private invoiceService: InvoiceService,
              private GeneralService: GeneralService,
              private SelectUnitService: SelectUnitService,
              private PlatformComponent: PlatformComponent) {


  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(v => { console.log(v);
    if(v['project_id']){
      this.filters['project_id'] = +v['project_id'];
      this.filters['status'] = v['status'];
      this.filters['created_at[from]'] = v['from_date'];
      this.filters['created_at[to]'] = v['to_date'];
    }
    })
    this.PlatformComponent.activeUrl = 'finance';

    // this.fetchItems();

    this.GeneralService.getProjects(this.SelectUnitService.getOrganization())
      .then(response=> { this.GeneralService.projects = response[('1')];
        this.columns[1]['searchOptions'].labels = response[('1')];});

    // this.employerService.getAllPayEmployers().then(
    //   response => {
    //     this.employers = response;
    //     this.employers.push({'id': '0', 'name': 'כלל המעסיקים'});
    //     this.employers.sort((a, b) => a.id - b.id);
    //   });
    // this.employerService.getProjects().then(response => {
    //   const column = this.dataTable.searchColumn(this.nameProjectName);
    //   this.projects = response;
    //   column['searchOptions'].labels = response;
    // });

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
  setInvoiceStatus(invoiceId: number, status: string): void {
    this.invoiceService.setInvoiceStatus(invoiceId, status).then(response => {
      this.helpers.setPageSpinner(false);
      if (response['message'] === 'success') {
        this.notificationService.success('נשמר בהצלחה.');
      } else if ('no_changes') {
        this.notificationService.info('לא ניתן לשנות רשומה שנשלחה לחשבונית ירוקה');
      } else {
        this.notificationService.error(response['message']);

      }
    });
  }
  fetchItems()
  {
    this.helpers.setPageSpinner(true);
    if(this.filters['project_id']){
      this.dataTable.criteria.filters = this.filters;
    }
    this.invoiceService.getInvoices(this.dataTable.criteria)
      .then(response => {
        console.log(response);
        this.dataTable.setItems(response);
        this.helpers.setPageSpinner(false);
      })
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
  }
  openTaxInvoice(): void {
    debugger;
    if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
      this.dataTable.setNoneCheckedWarning();
      return;
    }
    // const items = this.dataTable.criteria.isCheckAll ? this.dataTable.items : this.dataTable.criteria.checkedItems;
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
    // const items = this.dataTable.criteria.isCheckAll ? this.dataTable.items : this.dataTable.criteria.checkedItems;
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
  deleteInvoices(updateEmployee: boolean): void {
    if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
      this.dataTable.setNoneCheckedWarning();
      return;
    }
    const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};
    const totalCheckedIds = this.dataTable.criteria.isCheckAll ? this.dataTable.criteria.checkedItems.length > 0 ?
      this.dataTable.paginationData.totalItems - this.dataTable.criteria.checkedItems.length : this.dataTable.paginationData.totalItems :
      this.dataTable.criteria.checkedItems.length;

    const text = '  האם ברצונך לבצע מחיקה? נבחרו - ' + totalCheckedIds + ' רשומות';

    this.notificationService.warning(text, '', buttons).then(confirmation => {
      if (confirmation.value) {
        this.invoiceService.deleteInvoices(this.dataTable.criteria.checkedItems.map(
          item => item['id']), this.dataTable.criteria, updateEmployee).then(response => {
          this.helpers.setPageSpinner(false);
          if (response) {
            if (response['message'] === 'success') {
              this.notificationService.success('הרשומות נמחקו בהצלחה.');
              this.dataTable.criteria.checkedItems = [];
              this.dataTable.criteria.isCheckAll = false;
              this.fetchItems();
            } else if (response['message'] === 'no_rows_selected') {
              this.notificationService.info('לא נמצאו רשומות מתאימות לשליחה');
              this.dataTable.criteria.checkedItems = [];
              this.dataTable.criteria.isCheckAll = false;
              this.fetchItems();
            } else {
              this.notificationService.error('ארעה שגיאה.');
            }
          }
        });
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
        if (item.green_invoice_document !== null && item.green_invoice_document.number !== null
          && item.green_invoice_document.number !== '') {
          this.fileName = 'פירוט עובדים בחשבונית מספר - '  + item.green_invoice_document.number + '.xlsx';
        } else {
          this.fileName =  'פירוט עובדים בחשבונית'  + '.xlsx';
        }
        FileSaver.saveAs(blob, this.fileName);
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
}
