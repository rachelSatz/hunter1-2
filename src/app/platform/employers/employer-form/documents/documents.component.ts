import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from '../../../../shared/data-table/data-table.component';
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
import { GeneralService } from '../../../../shared/_services/http/general.service';
import { SelectUnitService } from '../../../../shared/_services/select-unit.service';
import { CommentsComponent } from '../remarks/comments.component';



@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css', '../../../../shared/data-table/data-table.component.css']
})
export class DocumentsComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  status = Object.keys(STATUS).map(function(e) {
    return { id: e, name: STATUS[e] };
  });
  paymentMethodItems = Object.keys(PAYMENT_METHOD).map(function(e) {
    return { id: e, name: PAYMENT_METHOD[e] };
  });
  error_status = Object.keys(ERROR_STATUS).map(function(e) {
    return { id: e, name: ERROR_STATUS[e] };
  });
  permissionsType = this.userSession.getPermissionsType('employers');
  arrInvoicesTmp: any[];
  items: any;
  spin: boolean;
  types = TYPES;
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
    this.fetchItems();
  }

  fetchItems() {
    this.invoiceService.getEmployerInvoices(this.dataTable.criteria, this.SelectUnitService.getEmployerRelation())
      .then(response => {
        this.dataTable.setItems(response);
        this.arrInvoicesTmp = response.items;
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

  ShowRemarks(item: Object): void {
    this.dialog.open(CommentsComponent, {
      data: item,
      width: '750px'
    });
  }
  // DownloadsEmployeesDeet(x: Object, y: Object): void {
  //   InvoicesComponent.downloadEmployeesExcel(x, y);
  //
  //
  // }

}
