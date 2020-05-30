import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { MONTHS } from 'app/shared/_const/months';
import { FormComponent } from './form/form.component';
import { ProductType } from 'app/shared/_models/product.model';
import { Status } from 'app/shared/_models/file-feedback.model';
import { placeholder, slideToggle } from 'app/shared/_animations/animation';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { InquiriesComponent} from 'app/shared/_dialogs/inquiries/inquiries.component';
import { InquiryFormComponent} from 'app/shared/_dialogs/inquiry-form/inquiry-form.component';
import { CommentsFormComponent } from 'app/shared/_dialogs/comments-form/comments-form.component';

import { Subscription } from 'rxjs';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { DocumentService } from 'app/shared/_services/http/document.service';
import { FileDepositionComponent } from 'app/shared/_dialogs/file-deposition/file-deposition.component';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { ManualStatus } from 'app/shared/_models/employee-feedback.model';
import { ChangeStatusComponent } from 'app/shared/_dialogs/change-status/change-status.component';


@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
  animations: [ slideToggle, placeholder ]
})
export class FilesComponent implements OnInit, OnDestroy  {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  sub = new Subscription();
  departmentId;
  year = new Date().getFullYear();
  years = [ this.year, (this.year - 1) , (this.year - 2), (this.year - 3)];
  months = MONTHS;
  selectYear: number;
  selectMonth: number;
  statuses = Status;
  fileId: number;
  planId: string;
  processId: number;
  feedbackDate: string;
  processName: string;
  manualStatus = ManualStatus;

  statuses_selected = [ 'not_sent',
    'sent',
    'sent_failed',
    'feedback_a',
    'feedback_a_failed',
    'partially_paid',
    'fully_paid',
    'paid_failed' ]
  list_status = Object.keys(Status).map(function(e) {
    return { id: e, name: Status[e] };
  });
  selectProductType = Object.keys(ProductType).map(function(e) {
    return { id: e, name: ProductType[e] };
  });
  readonly columns = [
    {name: 'process_name', label: 'שם תהליך', sortName: 'process__name', searchable: false},
    {name: 'month', label: 'חודש', searchable: false},
    {name: 'company_name', sortName: 'company.name', label:  'חברה מנהלת', searchable: false},
    {name: 'employer_name', label: 'שם מעסיק', searchable: false},
    {name: 'amount', label: 'סכום', searchable: false},
    {name: 'code', label: 'קוד אוצר', searchable: false},
    {name: 'status', label: 'סטטוס', selected: this.statuses_selected, multiple: true, searchOptions: { labels: this.list_status } },
    {name: 'manual_status', label: 'סטטוס פניה', searchable: false},
    {name: 'more', label: 'מידע נוסף', searchable: false},
    {name: 'comments', label: 'הערות', searchable: false},
    {name: 'created_at', label: 'תאריך יצירה',  searchOptions: { isDate: true }, isDisplay: false},
    {name: 'updated_at', label: 'תאריך עדכון אחרון',  searchOptions: { isDate: true }, isDisplay: false},
    {name: 'broadcast_date', label: 'תאריך שידור', searchOptions: { isDate: true }, isDisplay: false},
    {name: 'product_type', label: 'סוג מוצר', searchOptions: { labels: this.selectProductType }, isDisplay: false}
    ];


  constructor(public route: ActivatedRoute,
              private router: Router,
              protected notificationService: NotificationService,
              private dialog: MatDialog,
              private processService: ProcessService,
              public userSession: UserSessionService,
              private feedbackService: FeedbackService,
              private selectUnit: SelectUnitService,
              private documentService: DocumentService,
              private generalService: GeneralHttpService) {
  }


  ngOnInit() {
    this.fileId = this.route.snapshot.queryParams['fileId'];
    this.planId = this.route.snapshot.queryParams['planId'];
    this.processId = this.route.snapshot.queryParams['processId'];
    this.processName = this.route.snapshot.queryParams['processName'];
    this.selectYear = this.route.snapshot.queryParams['year'];
    this.selectYear = this.selectYear ?  Number(this.selectYear) : this.year;
    const month = this.route.snapshot.queryParams['month'];
    if (this.fileId && !this.processId) {}
    this.selectMonth = month ? Number(month) : this.selectMonth;
    this.sub.add(
      this.selectUnit.unitSubject.subscribe(() => {
            this.router.navigate([], {
              queryParams: {page: 1},
              relativeTo: this.route
            });
            this.fetchItems();
        }
      ));
  }


  fetchItems() {
    const organizationId = this.selectUnit.currentOrganizationID;
    const employerId = this.selectUnit.currentEmployerID;
    const departmentId = this.selectUnit.currentDepartmentID;
    if (this.selectMonth !== undefined) {
      this.dataTable.criteria.filters['month'] = this.selectMonth;
    }
    if (!this.planId) {
      this.dataTable.criteria.filters['year'] = this.selectYear;
    }

    if (departmentId !== 0) {
      this.dataTable.criteria.filters['departmentId'] = departmentId;
      this.dataTable.criteria.filters['employerId'] = employerId;
      this.dataTable.criteria.filters['organizationId'] = organizationId;
      if (this.fileId !== undefined) {
        this.dataTable.criteria.filters['fileId'] = this.fileId;
      }
      if (this.processId !== undefined) {
        this.dataTable.criteria.filters['processId'] = this.processId;
        this.feedbackService.getSendFeedbackByProcessId(this.processId)
          .then(response => {
            if (response) {
              this.feedbackDate = response['updated_at'];
            }
          });
      }
      this.feedbackService.getFileFeedbacks(this.dataTable.criteria)
        .then(response => {
          this.dataTable.setItems(response);
        });
    } else {
      return this.notificationService.warning('יש לבחור מחלקה');
    }
  }


  openFormDialog(item: any): void {
    this.dialog.open(FormComponent, {
      width: '1350px',
      height: '500px',
      data:  item,
    });
  }

  openInquiresDialog(item: any): void {
    const dialog =  this.dialog.open(InquiryFormComponent, {
      data: {'id': item.id, 'contentType': 'file_repayment', 'employerId': this.selectUnit.currentEmployerID,
        'companyId': item.company_id, 'file_name': item.file_name, 'product_code': item.product_code,
        'product_name': item.product_name},
      width: '550px',
    });

    this.sub.add(dialog.afterClosed().subscribe(created => {
      if (created) {
        this.generalService.getInquiries(item.id, 'groupthing').then(response =>
          item.inquiries = response
        );
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
      data: {'ids': ids, 'contentType': 'groupthing',
        'criteria': this.dataTable.criteria, 'planId': this.planId},
      width: '400px',
      panelClass: 'change-status-dialog'
    });

    this.sub.add(dialog.afterClosed().subscribe(res => {
      if (res) {
        this.dataTable.criteria.checkedItems = [];
        this.dataTable.criteria.isCheckAll = false;
        this.fetchItems(); }
    }));
  }

  openCommentsDialog(item?: any): void {
    let ids = [];
    if (!item) {
      if (this.dataTable.criteria.checkedItems.length === 0) {
        this.dataTable.setNoneCheckedWarning();
        return;
      }

      ids = this.dataTable.criteria.checkedItems.map(i => i['id']);
    } else {
      ids = [item.id];
    }

    const dialog =  this.dialog.open(CommentsFormComponent, {
      data: {'ids': ids, 'contentType': 'file_repayment', 'comments' : item ?  item.comments : [],
        'criteria': this.dataTable.criteria},
      width: '550px',
    });

    this.sub.add(dialog.afterClosed().subscribe(comments => {
      if (comments) {
        this.generalService.getComments(ids, 'groupthing').then(response => {
          if (item) {
            item.comments = [response];
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
      }
    }));
  }

  openInquiriesDetailsDialog(item: any): void {
    this.dialog.open(InquiriesComponent, {
      data: {'id': item.id, 'contentType': 'file_repayment', 'inquiries' : item.inquiries},
      width: '860px',
    });
  }

  detailsRecords(fileId: number, status: string): void {
    if (status !== 'feedback_a') {
      this.router.navigate(['/platform', 'feedback', 'employees'],
        {queryParams: {fileId: fileId, year: this.dataTable.criteria.filters['year']}});
    }
  }

  changeFileToNegative(): void {
    if (this.dataTable.criteria.checkedItems.length === 0) {
      this.dataTable.setNoneCheckedWarning();
      return;
    }

    this.documentService.getIsNegativeFile(this.selectUnit.currentEmployerID).then( res => {
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
    'files', this.selectUnit.currentDepartmentID, file).then( response => {
      if (response['result']) {
        this.dataTable.criteria.checkedItems = [];
        this.dataTable.criteria.isCheckAll = false;
        return this.notificationService.success('נוצר קובץ שלילי');
      } else {
        return this.notificationService.error('שגיאה ביצירת קובץ שלילי');
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
