import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from '@angular/router';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { MONTHS } from 'app/shared/_const/months';
import { ProductType } from 'app/shared/_models/product.model';
import { Status } from 'app/shared/_models/employee-feedback.model';
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
import { Location } from '@angular/common';

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
  years = [ this.year, (this.year - 1) , (this.year - 2), (this.year - 3)];
  months = MONTHS;
  statuses = Status;
  statusLabel = Object.keys(Status).map(function(e) {
      return { id: e, name: Status[e] };
  });
  selectProductType = Object.keys(ProductType).map(function(e) {
    return { id: e, name: ProductType[e] };
  });
  productTypes = ProductType;
  displayBack = false;

  readonly columns =  [
    { name: 'name', label: 'עובד', searchable: false},
    { name: 'personal_id', label: 'ת"ז' , searchable: false},
    { name: 'month', label: 'חודש שכר' , searchable: false},
    { name: 'company_name', label: 'חברה מנהלת' , searchable: false},
    { name: 'product_type', label: 'סוג מוצר', searchOptions: { labels: this.selectProductType }},
    { name: 'product_code', label: 'קוד אוצר' , searchable: false},
    { name: 'amount', label: 'סכום', searchable: false },
    { name: 'created_at', label: 'תאריך יצירה' , searchOptions: { isDate: true } },
    { name: 'updated_at', label: 'תאריך עדכון אחרון' , searchOptions: { isDate: true }},
    { name: 'status', label: 'סטטוס' , searchOptions: { labels: this.statusLabel } },
    { name: 'more', label: 'מידע נוסף' , searchable: false},
    { name: 'comments', label: 'הערות', searchable: false}
  ];
  constructor(public dialog: MatDialog,
              public route: ActivatedRoute,
              private notificationService: NotificationService,
              private feedbackService: FeedbackService,
              public userSession: UserSessionService,
              private selectUnitService: SelectUnitService,
              private generalService: GeneralHttpService,
              private _location: Location) {

  }

  ngOnInit() {
    this.fileId = this.route.snapshot.queryParams['fileId'];

    this.dataTable.criteria.filters['year'] = this.fileId ? Number(this.route.snapshot.queryParams['year']) : this.year;
    this.sub.add(this.selectUnitService.unitSubject.subscribe(() => this.fetchItems()));
  }


  fetchItems() {
    this.displayBack = this.fileId !== undefined && this.fileId !== '0' ? true : false;
    const organizationId = this.selectUnitService.currentOrganizationID;
    const employerId = this.selectUnitService.currentEmployerID;
    const departmentId = this.selectUnitService.currentDepartmentID;

    if (departmentId !== 0) {
      this.dataTable.criteria.filters['employerId'] = employerId;
      this.dataTable.criteria.filters['organizationId'] = organizationId;
      this.dataTable.criteria.filters['departmentId'] = departmentId;
      if (this.fileId) {
        this.dataTable.criteria.filters['fileId'] = this.fileId; }
      this.feedbackService.searchEmployeeData(this.dataTable.criteria).then(response => {
        this.dataTable.setItems(response);
      });
    }else { this.notificationService.warning('יש לבחור מחלקה'); }
  }

  openApplicationDialog(item: any): void {
    this.dialog.open(SendApplicationComponent, {
      data: item,
      width: '1350px',
    });
  }

  openInquiresDialog(item: any): void {
    const dialog = this.dialog.open(InquiryFormComponent, {
      data: {'id': item.id, 'contentType': 'employee_repayment',
        'employerId': this.selectUnitService.currentEmployerID, 'companyId': item.company_id,
        'file_name': item.sent_file_name, 'product_code': item.product_code,
        'product_type': item.product_type, 'employee_id': item.personal_id, 'employee_name': item.name},
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

  openCommentsDialog(item: any): void {
    const dialog = this.dialog.open(CommentsFormComponent, {
      data: {'id': item.id, 'contentType': 'monthlytransferblock', 'comments' : item.comments},
      width: '550px',
    });

    this.sub.add(dialog.afterClosed().subscribe(comments => {
      if (comments) {
        this.generalService.getComments(item.id, 'monthlytransferblock').then(response => {
          item.comments = response;
        });
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

  previous(): void {
    this._location.back();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
