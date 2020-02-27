import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { MONTHS } from 'app/shared/_const/months';
import { ProductType } from 'app/shared/_models/product.model';
import { ManualStatus, Status } from 'app/shared/_models/employee-feedback.model';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { placeholder, slideToggle } from 'app/shared/_animations/animation';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { InquiriesComponent } from 'app/shared/_dialogs/inquiries/inquiries.component';
import { SendApplicationComponent } from './send-application/send-application.component';
import { InquiryFormComponent } from 'app/shared/_dialogs/inquiry-form/inquiry-form.component';
import { CommentsFormComponent } from 'app/shared/_dialogs/comments-form/comments-form.component';
import { SendFeedbackComponent } from './send-feedback/send-feedback.component';
import { FileDepositionComponent } from 'app/shared/_dialogs/file-deposition/file-deposition.component';
import { DocumentService } from 'app/shared/_services/http/document.service';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { ChangeStatusComponent } from 'app/shared/_dialogs/change-status/change-status.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  providers: [MatDialog, FeedbackService],
  animations: [ slideToggle, placeholder]
})

export class EmployeesComponent implements OnInit , OnDestroy {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  sub = new Subscription();
  year = new Date().getFullYear();
  fileId: string;
  recordId: string;
  years = [ this.year, (this.year - 1) , (this.year - 2), (this.year - 3)];
  months = MONTHS;
  statuses = Status;
  selectYear: number;
  selectMonth: number;
  statusLabel = Object.keys(Status).map(function(e) {
      return { id: e, name: Status[e] };
  });
  selectProductType = Object.keys(ProductType).map(function(e) {
    return { id: e, name: ProductType[e] };
  });
  productTypes = ProductType;
  displayBack = false;
  manualStatus = ManualStatus;

  readonly columns =  [
    { name: 'name', label: 'עובד', searchable: false},
    { name: 'personal_id', label: 'ת"ז', sortName: 'employee_chr__employee__identifier' , searchable: false},
    { name: 'payment_month', label: 'חודש שכר' , searchable: false},
    { name: 'company_name', label: 'חברה מנהלת', sortName: 'group_thing__group__product__company__name' , searchable: false},
    { name: 'product_type', label: 'סוג מוצר', sortName: 'group_thing__group__product__type',
      searchOptions: {labels: this.selectProductType}},
    { name: 'product_code', label: 'קוד אוצר' , searchable: false},
    { name: 'amount', label: 'סכום', sortName: 'sum', searchable: false },
    { name: 'created_at', label: 'תאריך יצירה' , searchOptions: { isDate: true } },
    { name: 'updated_at', label: 'תאריך עדכון אחרון' , searchOptions: { isDate: true }},
    { name: 'status', label: 'סטטוס' , searchOptions: { labels: this.statusLabel } },
    { name: 'manual_status', label: 'סטטוס פניה', searchable: false},
    { name: 'more', label: 'מידע נוסף' , searchable: false},
    { name: 'comments', label: 'הערות', searchable: false}
  ];
  constructor(public dialog: MatDialog,
              private router: Router,
              public route: ActivatedRoute,
              private processService: ProcessService,
              private notificationService: NotificationService,
              private feedbackService: FeedbackService,
              public userSession: UserSessionService,
              private selectUnitService: SelectUnitService,
              private documentService: DocumentService,
              private generalService: GeneralHttpService,
              private helpers: HelpersService,
              private _location: Location) {

  }

  ngOnInit() {
    this.fileId = this.route.snapshot.queryParams['fileId'];
    this.displayBack = this.fileId !== undefined && this.fileId !== '0' ? true : false;
    this.recordId = this.route.snapshot.queryParams['recordId'];
    this.selectYear = this.fileId ? Number(this.route.snapshot.queryParams['year']) : this.year;
    this.sub.add(this.selectUnitService.unitSubject.subscribe(() => {
      this.router.navigate([], {
        queryParams: {page: 1},
        relativeTo: this.route
      });
      this.fetchItems();
    }));
  }


  fetchItems() {
    this.displayBack = this.fileId !== undefined && this.fileId !== '0' ? true : false;
    const organizationId = this.selectUnitService.currentOrganizationID;
    const employerId = this.selectUnitService.currentEmployerID;
    const departmentId = this.selectUnitService.currentDepartmentID;
    if (this.selectMonth !== undefined) {
      this.dataTable.criteria.filters['month'] = this.selectMonth;
    }
    if (!this.recordId) {
      this.dataTable.criteria.filters['year'] = this.selectYear;
    }
    if (departmentId !== 0) {
      this.dataTable.criteria.filters['employerId'] = employerId;
      this.dataTable.criteria.filters['organizationId'] = organizationId;
      this.dataTable.criteria.filters['departmentId'] = departmentId;
      if (this.fileId) {
        this.dataTable.criteria.filters['fileId'] = this.fileId; }
      if (this.recordId) {
        this.dataTable.criteria.filters['recordId'] = this.recordId; }

      this.feedbackService.searchEmployeeData(this.dataTable.criteria).then(response => {
        this.dataTable.setItems(response);
      });
    } else { this.notificationService.warning('יש לבחור מחלקה'); }
  }

  openApplicationDialog(item: any): void {
    this.helpers.setPageSpinner(false);
    this.feedbackService.getTransfer(item.id, item.sent_group_id, item.status_sent_group).then(response => {
      item.transfer_clause = response;
      this.helpers.setPageSpinner(true);
      this.dialog.open(SendApplicationComponent, {
        data: item,
        width: '1350px',
      });
    });

  }

  openInquiresDialog(item: any): void {
    const dialog = this.dialog.open(InquiryFormComponent, {
      data: {'id': item.id, 'contentType': 'employee_repayment',
        'employerId': this.selectUnitService.currentEmployerID, 'companyId': item.company_id,
        'file_name': item.sent_file_name, 'product_code': item.product_code,
        'product_type': item.product_type, 'employee_id': item.personal_id, 'employee_name': item.name,
        'amount': item.amount

      },
      width: '550px',
    });

    this.sub.add(dialog.afterClosed().subscribe(created => {
      if (created) {
        this.generalService.getInquiries(item.id, 'monthlytransferblock').then(response =>
          item.inquiries = response
        );
      }
    }));

  }

  openCommentsDialog(item?: any): void {
    this.helpers.setPageSpinner(true);
    let ids = [];
    if (!item) {
      if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
        this.dataTable.setNoneCheckedWarning();
        return;
      }

      ids = this.dataTable.criteria.checkedItems.map(i => i['id']);
    } else {
      ids = [item.id];


    }

    this.helpers.setPageSpinner(false);
    const dialog = this.dialog.open(CommentsFormComponent, {
      data: {'ids': ids, 'contentType': 'monthlytransferblock', 'comments' : item ?  item.comments : [],
        'criteria': this.dataTable.criteria},
      width: '550px',
    });

    this.sub.add(dialog.afterClosed().subscribe(comments => {
      this.helpers.setPageSpinner(true);
      if (comments) {
        if (!this.dataTable.criteria.isCheckAll) {
          this.generalService.getComments(ids, 'monthlytransferblock').then(response => {
            if (item) {
              item.comments = response;
              item.checked = false;
            } else {
              this.dataTable.criteria.checkedItems.forEach(obj => {
                obj['comments'] = response.filter(r => r['object_id'] === obj['id']);
                obj['checked'] = false;
              });
            }
            this.dataTable.criteria.checkedItems = [];
            this.dataTable.criteria.isCheckAll = false;
          });
        }else {
          this.dataTable.criteria.isCheckAll = false;
          this.fetchItems();
        }
        this.helpers.setPageSpinner(false);
      } else {
        this.helpers.setPageSpinner(false);
      }
    }));
  }

  changeStatus(): void {
    if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
      this.dataTable.setNoneCheckedWarning();
      return;
    }

    const ids = this.dataTable.criteria.checkedItems.map(i => i['id']);

    const dialog = this.dialog.open(ChangeStatusComponent, {
      data: {'ids': ids, 'contentType': 'monthlytransferblock',
        'criteria': this.dataTable.criteria},
      width: '400px',
      panelClass: 'change-status-dialog'
    });

    this.sub.add(dialog.afterClosed().subscribe(res => {
      if (res) {
        this.dataTable.criteria.checkedItems = [];
        this.dataTable.criteria.isCheckAll = false;
        this.fetchItems();
      }
    }));
  }

  openInquiriesDetailsDialog(item: any): void {
    if (item.inquiries.length === 0) {
      return;
    }

    this.dialog.open(InquiriesComponent, {
      data: {'id': item.id, 'contentType': 'employee_repayment', 'inquiries' : item.inquiries},
      width: '860px',
    });
  }

  regularFix(): void {
    const item = this.dataTable.criteria.checkedItems[0];
    if (this.dataTable.criteria.checkedItems.length === 0
      || this.dataTable.criteria.checkedItems.length > 1 ||
      item['status'] !== 'not_defrayed') {
        this.notificationService.warning('יש לבחור רשומה אחת שלא נפרעה');
        return;
    }

    this.router.navigate(['platform', 'process' , 'edit-payments', item['id'] ], {queryParams: {
      type: 'regular'
      }});
  }

  positiveNegativeFix(): void {
    if (this.dataTable.criteria.checkedItems.length === 0 ||
      this.dataTable.criteria.checkedItems.some(item =>
        item['status'] !== 'fully_defrayed' && item['status'] !== 'not_defrayed' )) {
      this.notificationService.warning('יש לבחור רשומות שנפרעו');
      return;
    }
    const ids = this.dataTable.criteria.checkedItems.map(item => item['id']);
    this.processService.positiveNegativeFix(ids).then(response => {
      if (response['result'] === 'yes') {
        this.notificationService.success('התהליך נוצר בהצלחה');
        this.dataTable.criteria.checkedItems = [];
        this.dataTable.criteria.isCheckAll = false;
        this.fetchItems();
      } else {
        this.notificationService.error('שגיאה');
      }

    });
  }
  sendFeedback(): void {
    if ((this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) ||
      this.dataTable.criteria.checkedItems.some(item => item['status'] !== 'not_defrayed')) {
      this.notificationService.warning('יש לבחור רשומות שלא נפרעו');
      return;
    }
    const ids = this.dataTable.criteria.checkedItems.map(item => item['id']);
    const dialog = this.dialog.open(SendFeedbackComponent, {
      data: {ids: ids, criteria: this.dataTable.criteria } ,
      width: '550px',
    });
  }

  changeFileToNegative(): void {
    if (this.dataTable.criteria.checkedItems.length === 0) {
      this.dataTable.setNoneCheckedWarning();
      return;
    }

    this.documentService.getIsNegativeFile(this.selectUnitService.currentEmployerID).then( res => {
      if (res) {
        this.sendchangeFileToNegative();
      } else {
        this.openAddFile();
      }
    });

  }

  openAddFile(): void {
    const dialog = this.dialog.open(FileDepositionComponent, {
      width: '550px',
      panelClass: 'send-email-dialog'
    });

    this.sub.add(dialog.afterClosed().subscribe(res => {
      this.sendchangeFileToNegative(res);
    }));
  }

  sendchangeFileToNegative(file?: File): void {
    this.processService.changeFileToNegative(this.dataTable.criteria.checkedItems.map(item => item['id']),
      'mtbs', this.selectUnitService.currentDepartmentID, file).then( response => {
      if (response['result']) {
        this.dataTable.criteria.checkedItems = [];
        this.dataTable.criteria.isCheckAll = false;
        return this.notificationService.success('נוצר קובץ שלילי');
      } else {
        return this.notificationService.error('שגיאה ביצירת קובץ שלילי');
      }
    });
  }


  previous(): void {
    this._location.back();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
