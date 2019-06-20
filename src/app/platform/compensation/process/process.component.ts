import * as FileSaver from 'file-saver';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnDestroy, OnInit, ViewChild  } from '@angular/core';

import { FormComponent } from './form/form.component';
import { DetailsComponent } from './details/details.component';
import { ProductType } from 'app/shared/_models/product.model';
import { Compensation } from 'app/shared/_models/compensation.model';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { EmployeesComponent } from './excel/employees/employees.component';
import { ProductService } from 'app/shared/_services/http/product.service';
import { placeholder, slideToggle } from 'app/shared/_animations/animation';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { ExcelComponent } from './excel/compensation/compensation.component';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { InquiriesComponent } from 'app/shared/_dialogs/inquiries/inquiries.component';
import { InquiryFormComponent } from 'app/shared/_dialogs/inquiry-form/inquiry-form.component';
import { CommentsFormComponent } from 'app/shared/_dialogs/comments-form/comments-form.component';
import { CompensationStatus, CompensationSendingMethods, ValidityMethods } from 'app/shared/_models/compensation.model';


@Component({
selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css'],
  animations: [ slideToggle, placeholder ]
})
export class ProcessComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  sub = new Subscription;

  productTypes = ProductType;

  statuses = CompensationStatus;
  selectStatuses = Object.keys(CompensationStatus).map(function(e) {
    return { id: e, name: CompensationStatus[e] };
  });

  sendingMethods = CompensationSendingMethods;
  employers = [];
  companies = [];
  sourceTypes = Object.keys(CompensationSendingMethods).map(function(e) {
    return { id: e, name: CompensationSendingMethods[e] };
  });
  responseTimes = [{id: 2, name: '0-2'}, {id: 4, name: '2-4'}, {id: 5, name: '5+'}];

  validity = Object.keys(ValidityMethods).map(function(e) {
    return { id: e, name: ValidityMethods[e] };
  });
  nameCompany = 'company';
  nameUserId = 'user_id';
  compensationId: number;

  readonly columns  = [
    { name: 'created_at', label: 'תאריך יצירת בקשה', searchOptions: { isDate: true }},
    { name: 'updated_at', label: 'תאריך עדכון בקשה', searchable: false},
    { name: this.nameUserId, label: 'יוצר הבקשה', searchOptions: { labels: [] } },
    { name: 'employer_name', label: 'מעסיק', sortName: 'department__employer__name', searchable: false},
    { name: 'department_name', label: 'מחלקה', sortName: 'department__name', searchable: false  },
    { name: 'employee', label: 'עובד', sortName: 'employee__first_name', searchable: false},
    { name: 'personal_id', label: 'ת"ז', sortName: 'employee__identifier', searchable: false},
    { name: this.nameCompany, label: 'חברה מנהלת', sortName: 'company__name', searchOptions: { labels: [] } },
    { name: 'product_type', label: 'סוג מוצר' , searchable: false },
    { name: 'validity_date', label: 'תאריך נכונות', searchable: false},
    { name: 'sending_method', label: 'מקור המידע', searchOptions: { labels: this.sourceTypes } },
    { name: 'status', label: 'סטטוס', searchOptions: { labels: this.selectStatuses }},
    { name: 'comment', label: 'הערות' , isSort: false, searchable: false},
    { name: 'download', label: 'הורדה' , isSort: false, searchable: false },
    { name: 'validity', label: 'תקינות', isSort: false, searchOptions: { labels: this.validity }},
    { name: 'response_time', label: 'העבר לטיפול' ,
      isSort: false, subLabel: 'ימי טיפול', searchOptions: { labels: this.responseTimes }, isDisplay: false},
  ];

  constructor(protected route: ActivatedRoute,
              private compensationService: CompensationService,
              private dialog: MatDialog,
              private departmentService: DepartmentService,
              private productService: ProductService,
              private employerService: EmployerService,
              protected notificationService: NotificationService,
              public userSession: UserSessionService,
              private selectUnit: SelectUnitService,
              private helpers: HelpersService,
              private generalService: GeneralHttpService) {
  }

  ngOnInit() {
    this.productService.getCompanies().then(response => {
      const column = this.dataTable.searchColumn(this.nameCompany);
      this.companies = response;
      column['searchOptions'].labels = this.companies;
    });
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
        // this.dataTable.paginationData.currentPage = 1;
        // this.dataTable.criteria.page = 1;
        this.fetchItems();
      }
    ));
    this.dataTable.placeHolderSearch = 'חפש עובד';
  }

  fetchItems() {
    this.compensationId = this.route.snapshot.params['id'];

    const organizationId = this.selectUnit.currentOrganizationID;
    const employerId = this.selectUnit.currentEmployerID;
    const departmentId = this.selectUnit.currentDepartmentID;

    if (organizationId) {
      this.dataTable.criteria.filters['employerId'] = employerId;
      this.dataTable.criteria.filters['organizationId'] = organizationId;
      this.dataTable.criteria.filters['departmentId'] = departmentId;
      this.dataTable.criteria.filters['eventCode'] = '9301';
      if (this.compensationId !== undefined ) {
        this.dataTable.criteria.filters['id'] = this.compensationId;
      }
      this.compensationService.getCompensations(this.dataTable.criteria).then(response => {
        this.setResponse(response);
      });
    }
  }

  setResponse(response: any): void {
    const users  = response.other['users'];
      // response.items.map(item => ({id: item['user_id'], name: item['username']}));
    const column = this.dataTable.searchColumn(this.nameUserId);
    column['searchOptions'].labels =  users;
    this.dataTable.setItems(response);
  }

  sendCompensations(): void {
    if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
      this.dataTable.setNoneCheckedWarning();
      return;
    }

    const items = this.dataTable.criteria.isCheckAll ? this.dataTable.items.map(item => item['id']) :
      this.dataTable.criteria.checkedItems.map(item => item['id']);

    this.helpers.setPageSpinner(true);
    this.compensationService.sendCompensations(items).then(response => {
      this.helpers.setPageSpinner(false);
      if (response) {
        if (response['list_exceptions'].length > 0) {
          this.notificationService.error('הבקשות נכשלו. ' + response['list_exceptions'] ,
            ' הבקשות נכשלו.  ' + response['message'] );
        } else if (response['message'] !== 'success') {
          this.notificationService.error(response['message']);
          this.fetchItems();
        } else {
          this.notificationService.success('הבקשות נשלחו בהצלחה.');
          this.dataTable.criteria.checkedItems = [];
          this.dataTable.criteria.isCheckAll = false;
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

    const dialog = this.dialog.open(FormComponent,
      {
      data: { companies: this.companies,
        departmentId: this.selectUnit.currentDepartmentID ,
        employerID: this.selectUnit.currentEmployerID},
        width: '450px'
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
    if ((!this.dataTable.criteria ||
      this.dataTable.criteria.checkedItems.length === 0)
      && !this.dataTable.criteria.isCheckAll) {
      this.dataTable.setNoneCheckedWarning();
      return;
    }
    const items = this.dataTable.criteria.isCheckAll ? this.dataTable.items.map(item => item['id']) :
      this.dataTable.criteria.checkedItems.map(item => item['id']);

    this.compensationService.manualChangingStatus(items, this.dataTable.criteria).then(response => {
        this.dataTable.criteria.checkedItems = [];
        this.dataTable.criteria.isCheckAll = false;
        this.setResponse(response);
    });
  }

  openCommentsDialog(item: any): void {
    const dialog = this.dialog.open(CommentsFormComponent, {
      data: {'id': item.id, 'contentType': 'compensation', 'comments' : item.comments},
      width: '450px'
    });

    this.sub.add(dialog.afterClosed().subscribe(comments => {
      if (comments) {
        this.generalService.getComments(item.id, 'compensation').then(response => {
          item.comments = response;
        });
      }
    }));
  }

  openSendToDialog(item: Compensation): void {
    const dialog = this.dialog.open(InquiryFormComponent, {
      data: {'id': item.id, 'contentType': 'compensation',
        'employerId': item.employer_id,
        'companyId': item.company_id,
        'error_details': item.feedback_level === 'record' ?
          item.error_details :  item.error_details_file,
        'ans_manuf': item.answering_manufacturer,
        'feedback_level': item.feedback_level
      },
      width: '500px'
    });

    this.sub.add(dialog.afterClosed().subscribe(created => {
      if (created) {
        this.generalService.getInquiries(item.id, 'compensation').then(response =>
          item.inquiries = response
        );
      }
    }));
  }

  openDetailsDialog(item: Object): void {
    const dialog = this.dialog.open(DetailsComponent, {
      data: item,
      width: '680px',
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

  openInquiriesDialog(compensation: any): void {
    if (compensation.inquiries.length === 0) {
      return;
    }

    this.dialog.open(InquiriesComponent, {
      data: {'id': compensation.id, 'contentType': 'compensation', 'inquiries': compensation.inquiries},
      width: '800px'
    });
  }

  getValidityImage(item: Compensation): string {
    const balance = item.has_by_safebox || item.portal_balance <= 0 ? 'reported_balance' : 'portal_balance';

    let path = '/assets/img/icons/';
    path += (item[balance] - item.projected_balance === 0) ? 'check' : 'times';
    return path + '.svg';
  }

  PdfFile(rowId: number, type: string): any {
      this.compensationService.downloadPdfFile(rowId).then(response => {
        if (response) {
          const byteCharacters = atob(response['data']);
          const byteNumbers = new Array(byteCharacters.length);
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
    this.sub.unsubscribe();
  }
}
