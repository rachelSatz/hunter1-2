import {Component, OnDestroy, OnInit} from '@angular/core';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import {ActivatedRoute} from '@angular/router';
import {FormControl} from '@angular/forms';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material';
import { NotificationService } from 'app/shared/_services/notification.service';
import {InvoiceService} from '../../../shared/_services/http/invoice.service';
import {ProactiveInvoiceFormComponent} from './proactive-invoice-form/proactive-invoice-form.component';
import {INVOICE_TYPES, STATUS, ALL_STATUS} from 'app/shared/_models/invoice.model';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';
import {Subscription} from 'rxjs';
import {HelpersService} from '../../../shared/_services/helpers.service';
import {RemarksFormComponent} from './remarks-form/remarks-form.component';
import {EmployersFinanceExcelComponent} from './employers-finance-excel/employers-finance-excel.component';
import {CompensationSendingMethods, CompensationStatus} from '../../../shared/_models/compensation.model';


@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', './invoices.component.css']
})
export class InvoicesComponent extends DataTableComponent implements OnInit, OnDestroy {
  employers = [];
  departments = [];
  invoices = [];
  invoiceTypes = INVOICE_TYPES;
  invoice_status = STATUS;
  selectStatus = Object.keys(ALL_STATUS).map(function(e) {
    return { id: e, name: ALL_STATUS[e] };
  });

  invoice_all_status = ALL_STATUS;
  sub = new Subscription;

  readonly headers: DataTableHeader[] =  [
    { column: 'employer_name', label: 'שם מעסיק' },
    { column: 'green_invoice_number', label: 'מספר חשבונית בירוקה' },
    { column: 'amount', label: 'סכום' },
    { column: 'amount_ids', label: 'כמות ת"ז' },
    { column: 'for_month', label: 'בגין חודש' },
    { column: 'created_at', label: 'ת.יצירה' },
    { column: 'last_payment_date', label: 'לתשלום עד' },
    { column: 'kind', label: 'סוג חשבונית' },
    { column: 'status',  label: 'סטטוס', searchOptions: { labels: this.invoice_status } },
    { column: 'remark', label: 'הערות' },
    { column: 'options', label: 'אפשרויות' }
  ];

  constructor(route: ActivatedRoute, private invoiceService: InvoiceService, private selectUnit: SelectUnitService,
              private helpers: HelpersService,
              private dialog: MatDialog) {super(route); }

  ngOnInit() {
    this.fetchItems();
    // for (const status in this.invoice_status) {
    //   this.statusSelectOptions.push({ value: status, label: this.invoice_status[status] });
    // }
    super.ngOnInit();
  }
  fetchItems(): void {
    // const organizationId = this.selectUnit.currentOrganizationID;
    // const employerId = this.selectUnit.currentEmployerID;

    // this.searchCriteria['employerId'] = this.selectUnit.currentEmployerID;
    // this.searchCriteria['organizationId'] = this.selectUnit.currentOrganizationID;



      this.invoiceService.getInvoices(this.searchCriteria).then(response => {
          this.setItems(response) ;
        });
      }


  valueDateChange(keyCode: Date): void {
    this.searchCriteria['request_created_at'] =
      formatDate(keyCode, 'yyyy-MM-dd', 'en-US', '+0530').toString();
    this.search();
  }

  valueDateChange2(keyCode: Date): void {
    this.searchCriteria['for_month'] =
      formatDate(keyCode, 'yyyy-MM-dd', 'en-US', '+0530').toString();
    this.search();
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
  ngOnDestroy() {
    super.ngOnDestroy();
    this.sub.unsubscribe();
  }
}
// file_count', JSON.stringify(file_count)
