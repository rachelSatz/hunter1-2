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
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { InquiriesComponent} from 'app/shared/_dialogs/inquiries/inquiries.component';
import { InquiryFormComponent} from 'app/shared/_dialogs/inquiry-form/inquiry-form.component';
import { CommentsFormComponent } from 'app/shared/_dialogs/comments-form/comments-form.component';

import { Subscription } from 'rxjs';


@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  animations: [ slideToggle, placeholder ]
})
export class FilesComponent implements OnInit, OnDestroy  {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  sub = new Subscription();
  fileData;
  departmentId;
  year = new Date().getFullYear();
  years = [ this.year, (this.year - 1) , (this.year - 2), (this.year - 3)];
  months = MONTHS;
  statuses = Status;

  list_status = Object.keys(Status).map(function(e) {
    return { id: e, name: Status[e] };
  });
  selectProductType = Object.keys(ProductType).map(function(e) {
    return { id: e, name: ProductType[e] };
  });
  readonly columns = [
    {name: 'company_name', label: 'חברה מנהלת', searchable: false},
    {name: 'employer_name', label: 'שם מעסיק', searchable: false},
    {name: 'amount', label: 'סכום', searchable: false},
    {name: 'code', label: 'קוד אוצר', searchable: false},
    {name: 'status', label: 'סטטוס', searchOptions: { labels: this.list_status } },
    {name: 'more', label: 'מידע נוסף', searchable: false},
    {name: 'comments', label: 'הערות', searchable: false},
    {name: 'created_at', label: 'תאריך יצירה',  searchOptions: { isDate: true }, isDisplay: false},
    {name: 'updated_at', label: 'תאריך עדכון אחרון',  searchOptions: { isDate: true }, isDisplay: false},
    {name: 'broadcast_date', label: 'תאריך שידור', searchOptions: { isDate: true }, isDisplay: false},
    {name: 'product_type', label: 'סוג מוצר', searchOptions: { labels: this.selectProductType }, isDisplay: false}
  ];


  constructor(route: ActivatedRoute,
              private router: Router,
              protected notificationService: NotificationService,
              private dialog: MatDialog,
              private userSession: UserSessionService,
              private feedbackService: FeedbackService,
              private selectUnit: SelectUnitService,
              private generalService: GeneralHttpService) {

  }


  ngOnInit() {
    this.dataTable.criteria.filters['year'] = this.year;
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
        this.dataTable.paginationData.currentPage = 1;
        this.dataTable.criteria.page = 1;
        this.fetchItems();
      }
    ));
  }

  fetchItems() {
    const organizationId = this.selectUnit.currentOrganizationID;
    const employerId = this.selectUnit.currentEmployerID;
    const departmentId = this.selectUnit.currentDepartmentID;

    if (departmentId !== 0) {
      this.dataTable.criteria.filters['departmentId'] = departmentId;
      this.dataTable.criteria.filters['employerId'] = employerId;
      this.dataTable.criteria.filters['organizationId'] = organizationId;
      this.feedbackService.getFileFeedbacks(this.dataTable.criteria)
        .then(response => {
          this.dataTable.setItems(response);
          this.fileData = response;
        });
    } else {
      this.notificationService.warning('יש לבחור מחלקה');
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
      data: {'id': item.id, 'contentType': 'groupthing', 'employerId': this.selectUnit.currentEmployerID,
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

  openCommentsDialog(item: any): void {
    const dialog =  this.dialog.open(CommentsFormComponent, {
      data: {'id': item.id, 'contentType': 'groupthing', 'comments' : item.comments},
      width: '550px',
    });

    this.sub.add(dialog.afterClosed().subscribe(comments => {
      if (comments) {
        this.generalService.getComments(item.id, 'groupthing').then(response => {
          item.comments = response;
        });
      }
    }));
  }

  openInquiriesDetailsDialog(item: any): void {
    this.dialog.open(InquiriesComponent, {
      data: {'id': item.id, 'contentType': 'groupthing', 'inquiries' : item.inquiries},
      width: '860px',
    });
  }

  detailsRecords(fileId: number): void {
    this.router.navigate(['/platform', 'feedback', 'employees' ],
      { queryParams: {  fileId: fileId, year: this.dataTable.criteria.filters['year'] }});
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
