import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs/Subscription';
import * as FileSaver from 'file-saver';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { FormComponent } from './form/form.component';
import { ExcelComponent } from './excel/excel.component';
import { CommentsComponent } from './comments/comments.component';
import { DetailsComponent } from './details/details.component';
import { SendToComponent } from './send-to/send-to.component';
import { InquiriesComponent } from './inquiries/inquiries.component';

import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { ProductService } from 'app/shared/_services/http/product.service';
import { NotificationService } from 'app/shared/_services/notification.service';

import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { CompensationStatus, CompensationSendingMethods } from 'app/shared/_models/compensation.model';
import { ProductType } from 'app/shared/_models/product.model';
import {formatDate} from '@angular/common';


@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', './process.component.css'],
  animations: [
    trigger('slideToggle', [
      state('inactive', style({
        display: 'none',
        height: '0',
        opacity: '0',
        visibility: 'hidden'
      })),
      state('active', style({
        display: '*',
        height: '*',
        opacity: '1',
        visibility: 'visible'
      })),
      transition('active => inactive', animate('200ms')),
      transition('inactive => active', animate('200ms'))
    ]),
    trigger('placeholder', [
      state('inactive', style({
        fontSize: '*',
        top: '*'
      })),
      state('active', style({
        fontSize: '10px',
        top: '-10px'
      })),
      transition('active => inactive', animate('300ms ease-in')),
      transition('inactive => active', animate('300ms ease-in'))
    ])
  ]
})
export class ProcessComponent extends DataTableComponent implements OnInit, OnDestroy {

  formSubscription: Subscription;
  commentsSubscription: Subscription;
  // excelSubscription: Subscription;
  extraSearchCriteria = 'inactive';

  productTypes = ProductType;
  selectProductTypes = Object.keys(ProductType).map(function(e) {
    return { id: e, name: ProductType[e] };
  });

  statuses = CompensationStatus;
  selectStatuses = Object.keys(CompensationStatus).map(function(e) {
    return { id: e, name: CompensationStatus[e] };
  });

  sendingMethods = CompensationSendingMethods;
  selectSendingMethods = Object.keys(CompensationSendingMethods).map(function(e) {
    return { id: e, name: CompensationSendingMethods[e] };
  });

  employees = [];
  departments = [];
  companies = [];
  users = [];
  sourceTypes = [{id: 'safebox', name: 'כספת'}, {id: 'email', name: 'מייל'}];
  responseTimes = [{id: 2, name: '0-2'}, {id: 4, name: '2-4'}, {id: 5, name: '5+'}];

  spin: boolean;


  readonly headers: DataTableHeader[] =  [
    { column: 'created_at', label: 'תאריך יצירת בקשה' }, { column: 'updated_at', label: 'תאריך עדכון בקשה' },
    { column: 'username', label: 'יוצר הבקשה' },
    { column: 'employer_name', label: 'מעסיק' }, { column: 'department_name', label: 'מחלקה' },
    { column: 'employee_name', label: 'עובד' }, { column: 'personal_id', label: 'ת"ז' },
    { column: 'company_name', label: 'חברה מנהלת' }, { column: 'product_type', label: 'סוג מוצר' },
    { column: 'validity_date', label: 'תאריך נכונות' }, { column: 'sent_to', label: 'מקור המידע' },
    { column: 'status', label: 'סטטוס' }, { column: null, label: 'העבר לטיפול' },
    { column: null, label: 'פניות' }, { column: null, label: 'הערות' },
    { column: null, label: 'הורדה' }, { column: null, label: 'פרטים' },
    { column: 'validity_status', label: 'תקינות' }
  ];



  constructor(protected route: ActivatedRoute, private compensationService: CompensationService,
              private dialog: MatDialog, private departmentService: DepartmentService,
              private productService: ProductService, protected notificationService: NotificationService
              ) {
    super(route, notificationService);
  }

  ngOnInit() {
    this.departmentService.getDepartments().then(response => this.departments = response);
    this.productService.getCompanies().then(response => this.companies = response);
    this.fetchItems();
  }

  fetchItems(): void {
    this.compensationService.getCompensations(this.searchCriteria).then(response => {
         this.setResponse(response) ;
      }
    );

  }

  setResponse(response: any[]): void {
    this.users  = response.map(item => ({id: item['user_id'], name: item['username']}));
    this.users =  this.users.filter((x) => this.users.indexOf(x) === 0);
    this.setItems(response);
  }

  loadEmployees(departmentID: number): void {
    this.departmentService.getEmployees(departmentID).then(response => this.employees = response);
  }

  valueDateChange(keyCode: Date): void {
    this.searchCriteria['date_request'] =
      formatDate(keyCode, 'yyyy-MM-dd', 'en-US', '+0530').toString();
    this.search();
  }

  sendCompensations(): void {
    if (this.checkedItems.length === 0) {
      this.setNoneCheckedWarning();
      return;
    }

    this.compensationService.sendCompensations(this.checkedItems.map(item => item.id)).then(response => {
      if (response) {
        this.notificationService.success('הבקשות נשלחו בהצלחה.');
        this.checkedItems = [];
        this.isCheckAll = false;
      }
    });
  }

  openFormDialog(): void {
    const dialog = this.dialog.open(FormComponent, {
      data: { companies: this.companies, departments: this.departments }
    });

    this.formSubscription = dialog.afterClosed().subscribe(created => {
      if (created) {
        this.fetchItems();
      }
    });
  }

  openExcelDialog(): void {
    const dialog = this.dialog.open(ExcelComponent, {
      width: '450px'
    });
  }

  manualChangingStatus(): void {
    if (this.checkedItems.length === 0) {
      this.setNoneCheckedWarning();
      return;
    }

    this.compensationService.manualChangingStatus(this.checkedItems.map(item => item.id), this.searchCriteria).then(response => {
      // if (response) {
      //   this.notificationService.success('הבקשות נשלחו בהצלחה.');
        this.checkedItems = [];
        this.isCheckAll = false;
        this.setResponse(response);
       // }
    });
  }


  openCommentsDialog(item: Object): void {
    const dialog = this.dialog.open(CommentsComponent, {
      data: item,
      width: '450px'
    });

    this.commentsSubscription = dialog.afterClosed().subscribe(comments => {
      if (comments) {
        item['comments'] = comments;
      }
    });
  }

  openSendToDialog(item: Object): void {
    this.dialog.open(SendToComponent, {
      data: item,
      width: '500px'
    });
  }

  openDetailsDialog(item: Object): void {
    this.dialog.open(DetailsComponent, {
      data: item,
      width: '600px'
    });
  }

  openInquiriesDialog(compensation: Object): void {
    if (compensation['inquiry_count'] === 0) {
      return;
    }

    this.dialog.open(InquiriesComponent, {
      data: compensation['id'],
      width: '800px'
    });
  }

  getValidityImage(item: Object): string {
    let path = '/assets/img/icons/';
    path += item['projected_balance'] === ['item.projected_report_balance'] ? 'check' : 'times';
    return path + '.svg';
  }

  toggleExtraSearch(): void {
    this.extraSearchCriteria = (this.extraSearchCriteria === 'active') ? 'inactive' : 'active';
  }

  downloadPdfFile(rowId: number): void {
    this.spin = true;
    this.compensationService.downloadPdfFile(rowId)
      .then(response => {
        const byteCharacters = atob(response);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: 'application/pdf'});
        FileSaver.saveAs(blob, 'Compensation-Request-Reply.pdf');

        this.spin = false;
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }

    if (this.commentsSubscription) {
      this.commentsSubscription.unsubscribe();
    }
  }
}
