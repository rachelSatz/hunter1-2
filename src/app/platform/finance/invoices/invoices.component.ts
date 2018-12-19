import { Component, OnInit } from '@angular/core';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import {ActivatedRoute} from '@angular/router';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material';
import { NotificationService } from 'app/shared/_services/notification.service';
import {InvoiceService} from '../../../shared/_services/http/invoice.service';
import {ProactiveInvoiceFormComponent} from './proactive-invoice-form/proactive-invoice-form.component';
import {INVOICE_TYPES, STATUS, ALL_STATUS} from '../../../shared/_models/invoice.model';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';
import {Subscription} from 'rxjs';
import {HelpersService} from '../../../shared/_services/helpers.service';
import {RemarksFormComponent} from './remarks-form/remarks-form.component';
import {EmployersFinanceExcelComponent} from './employers-finance-excel/employers-finance-excel.component';


@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', './invoices.component.css']
})
export class InvoicesComponent extends DataTableComponent implements OnInit {
  employers = [];
  departments = [];
  invoices = [];
  invoiceTypes = INVOICE_TYPES;
  invoice_status = STATUS;
  invoice_all_status = ALL_STATUS;
  readonly statusSelectOptions = [];
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
    this.invoiceService.getInvoices().then(response => {
      this.setItems(response);
    });
    // for (const status in this.invoice_status) {
    //   this.statusSelectOptions.push({ value: status, label: this.invoice_status[status] });
    // }
  }
  fetchItems(): void {
    const organizationId = this.selectUnit.currentOrganizationID;
    const employerId = this.selectUnit.currentEmployerID;

    this.searchCriteria['employerId'] = this.selectUnit.currentEmployerID;
    this.searchCriteria['organizationId'] = this.selectUnit.currentOrganizationID;

    if (organizationId) {
      this.searchCriteria['employerId'] = employerId;
      this.searchCriteria['organizationId'] = organizationId;

      this.invoiceService.getInvoices(this.searchCriteria).then(response => {
          this.setResponse(response) ;
        });

      if (this.selectUnit.currentEmployerID) {
        this.departments = this.helpers.organizations.find(o => o.id === organizationId).
        employer.find( e => e.id === employerId).department;
      } else {

        this.departments = [];
        this.helpers.organizations.find(o => o.id === organizationId)
          .employer.forEach( e => {
          if (e && e.id !== 0) {
            e.department.forEach(d => {
              if (d) { this.departments.push(d); }
            });
          }});

        // this.departments.forEach( d => {
        //   if (d.employees) { d.employees.forEach( e =>   {
        //     this.employees.push(e.name);
        //   }); }
        // });
      }
    }




    // this.employerService.getDepartmentsAndEmployees(this.selectUnit.currentEmployerID, this.selectUnit.currentOrganizationID)
    //   .then(response => {
    //     this.departments = response['departments'];
    //     this.employees = response['employees'];
    //   });

    // this.invoiceService.getInvoices(this.searchCriteria).then(response => {
    //   this.setResponse(response) ;
    // });

  }
  setResponse(response: any[]): void {
    this.setItems(response);
  }
  valueDateChange(keyCode: Date): void {
    this.searchCriteria['date_request'] =
      formatDate(keyCode, 'yyyy-MM-dd', 'en-US', '+0530').toString();
    this.search();
  }

  valueDateChange2(keyCode: Date): void {
    this.searchCriteria['date_request2'] =
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
}
// file_count', JSON.stringify(file_count)
