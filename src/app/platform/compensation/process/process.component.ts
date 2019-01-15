import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { formatDate } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import * as FileSaver from 'file-saver';
import {Observable} from 'rxjs';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { FormComponent } from './form/form.component';

import { ExcelComponent } from './excel/compensation/compensation.component';

import { EmployeesComponent } from './excel/employees/employees.component';
import { CommentsComponent } from './comments/comments.component';
import { DetailsComponent } from './details/details.component';
import { SendToComponent } from './send-to/send-to.component';
import { InquiriesComponent } from './inquiries/inquiries.component';
import { ErrorMessageComponent } from './error-message/error-message.component';

import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { ProductService } from 'app/shared/_services/http/product.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { HelpersService } from 'app/shared/_services/helpers.service';

import { Compensation } from 'app/shared/_models/compensation.model';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { CompensationStatus, CompensationSendingMethods, ValidityMethods } from 'app/shared/_models/compensation.model';
import { ProductType } from 'app/shared/_models/product.model';


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
  myControl = new FormControl();
  sub = new Subscription;

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
  employers = [];
  // employees = [];
  // departments = [];
  companies = [];
  users = [];
  sourceTypes = Object.keys(CompensationSendingMethods).map(function(e) {
    return { id: e, name: CompensationSendingMethods[e] };
  });
  responseTimes = [{id: 2, name: '0-2'}, {id: 4, name: '2-4'}, {id: 5, name: '5+'}];

  validity = Object.keys(ValidityMethods).map(function(e) {
    return { id: e, name: ValidityMethods[e] };
  });
  filteredOptions: Observable<string[]>;
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
              private productService: ProductService, private employerService: EmployerService,
              protected notificationService: NotificationService,
              private selectUnit: SelectUnitService,
              private helpers: HelpersService
              ) {
    super(route, notificationService);
  }

  ngOnInit() {
    this.productService.getCompanies().then(response => this.companies = response);
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => this.fetchItems()));

    super.ngOnInit();
  }


  fetchItems(): void {
    const organizationId = this.selectUnit.currentOrganizationID;
    const employerId = this.selectUnit.currentEmployerID;
    const departmentId = this.selectUnit.currentDepartmentID;

    if (organizationId) {
      this.searchCriteria['employerId'] = employerId;
      this.searchCriteria['organizationId'] = organizationId;
      this.searchCriteria['departmentId'] = departmentId;

      this.compensationService.getCompensations(this.searchCriteria).then(response => {
        this.setResponse(response);
      });
    }
  }

  setResponse(response: any[]): void {
    this.users  = response.map(item => ({id: item['user_id'], name: item['username']}));
    this.users =  this.users.filter((x) => this.users.indexOf(x) === 0);
    this.setItems(response);
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
    this.helpers.setPageSpinner(true);
    this.compensationService.sendCompensations(this.checkedItems.map(item => item.id)).then(response => {
      this.helpers.setPageSpinner(false);
      if (response) {
        if (response['list_exceptions'].length > 0) {
          this.notificationService.error('הבקשות נכשלו. ' + response['list_exceptions'] ,
            ' הבקשות נכשלו.  ' + response['message'] );
        }else {
          this.notificationService.success('הבקשות נשלחו בהצלחה.');
          this.checkedItems = [];
          this.isCheckAll = false;
          this.fetchItems();
        }
      }else {
        this.notificationService.error(' הבקשות נכשלו. ', 'הבקשות נכשלו.');
      }
    });
  }

  openFormDialog(): void {
    if (this.selectUnit.currentDepartmentID === 0) {
      this.notificationService.error('יש לבחור מחלקה', '');
      return;
    }

    const dialog = this.dialog.open(FormComponent, {
      data: { companies: this.companies, departmentId: this.selectUnit.currentDepartmentID , employerID: this.selectUnit.currentEmployerID}
    });

    this.sub.add(dialog.afterClosed().subscribe(created => {
      if (created) {
        this.fetchItems();
      }
    }));
  }

  openExcelDialog(): void {
    if (this.selectUnit.currentEmployerID > 0) {
      const dialog = this.dialog.open(ExcelComponent, {
        width: '450px'
      });

      this.sub.add(dialog.afterClosed().subscribe(() => {
        this.fetchItems();
      }));

    }else {
      this.notificationService.error('לא נבחר מעסיק', 'יש לבחור מעסיק');
    }
  }

  openExcelEmployeesDialog(): void {
    if (this.selectUnit.currentDepartmentID === 0) {
      this.notificationService.error('יש לבחור מחלקה', '');
      return;
    }
    this.dialog.open(EmployeesComponent, {
      data: {  departmentId: this.selectUnit.currentDepartmentID },
      width: '450px',
      panelClass: 'excel-employees-dialog'
    });
  }

  manualChangingStatus(): void {
    if (this.checkedItems.length === 0) {
      this.setNoneCheckedWarning();
      return;
    }

    this.compensationService.manualChangingStatus(this.checkedItems.map(item => item.id),
      this.searchCriteria).then(response => {
        this.checkedItems = [];
        this.isCheckAll = false;
        this.setResponse(response);
    });
  }

  openCommentsDialog(item: Object): void {
    const dialog = this.dialog.open(CommentsComponent, {
      data: item,
      width: '450px'
    });

    this.sub.add(dialog.afterClosed().subscribe(comments => {
      if (comments) {
        item['comments'] = comments;
      }
    }));
  }

  openSendToDialog(item: Object): void {
    this.dialog.open(SendToComponent, {
      data: item,
      width: '500px'
    });
  }

  openDetailsDialog(item: Object): void {
    const dialog = this.dialog.open(DetailsComponent, {
      data: item,
      width: '680px'
    });

    this.sub.add(dialog.afterClosed().subscribe(created => {
      if (created) {
        this.fetchItems();
      }
    }));
  }

  openErrorMessageDialog(item: Object): void {
    this.dialog.open(ErrorMessageComponent, {
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

  getValidityImage(item: Compensation): string {
    const balance = item.has_by_safebox || item.portal_balance <= 0 ? 'reported_balance' : 'portal_balance';

    let path = '/assets/img/icons/';
    path += (item[balance] - item.projected_balance === 0) ? 'check' : 'times';
    return path + '.svg';
  }

  toggleExtraSearch(): void {
    this.extraSearchCriteria = (this.extraSearchCriteria === 'active') ? 'inactive' : 'active';
  }

  PdfFile(rowId: number, type: string): any {
      this.compensationService.downloadPdfFile(rowId).then(response => {
        if (response) {
          const byteCharacters = atob(response);
          const byteNumbers = new Array(byteCharacters.length);
          console.log(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {type: 'application/pdf'});
          const fileURL = URL.createObjectURL(blob);
          if (type === 'show') {
            window.open(fileURL);
          } else {
            FileSaver.saveAs(blob, 'Compensation-Request-Reply.pdf');
          }
        }else {
          type =  type === 'show' ?  'להציג' : 'להוריד';
          this.notificationService.error('', ' אין אפשרות ' + type +  ' קובץ ');
        }
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.sub.unsubscribe();
  }
}
