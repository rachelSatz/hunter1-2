import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { NotificationService } from 'app/shared/_services/notification.service';

import { SendApplicationComponent } from './send-application/send-application.component';
import { InquiryFormComponent } from 'app/shared/_dialogs/inquiry-form/inquiry-form.component';
import { CommentsFormComponent } from 'app/shared/_dialogs/comments-form/comments-form.component';
import { InquiriesComponent } from 'app/shared/_dialogs/inquiries/inquiries.component';

import { Month } from 'app/shared/_const/month-bd-select';
import { ProductType } from 'app/shared/_models/product.model';
import { Status } from 'app/shared/_models/employee-feedback.model';
import { placeholder, slideToggle } from 'app/shared/_animations/animation';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css', '../../../shared/data-table/data-table.component.css'],
  providers: [MatDialog, FeedbackService],
  animations: [ slideToggle, placeholder]
})

export class EmployeesComponent extends DataTableComponent implements OnInit {

  sub = new Subscription();
  year = (new Date()).getFullYear();
  years = [ this.year, (this.year - 1) , (this.year - 2), (this.year - 3)];
  months = Month;
  statuses = Status;
  statusLabel = Object.keys(Status).map(function(e) {
      return { id: e, name: Status[e] };
  });
  extraSearchCriteria = 'inactive';
  selectProductType = Object.keys(ProductType).map(function(e) {
    return { id: e, name: ProductType[e] };
  });
  productTypes = ProductType;

  readonly headers: DataTableHeader[] =  [
    { column: '', label: 'עובד' },
    { column: 'process_name', label: 'ת"ז' },
    { column: 'employer_name', label: 'חודש שכר' },
    { column: 'code', label: 'חברה מנהלת' },
    { column: 'date', label: 'סוג מוצר' },
    { column: 'amount', label: 'קוד אוצר' },
    { column: 'status', label: 'סכום' },
    { column: 'status', label: 'תאריך עדכון אחרון' },
    { column: 'status', label: 'סטטוס' },
    { column: 'more', label: 'מידע נוסף'},
    { column: 'send_request', label: 'שלח פנייה'},
    {column: 'inquiries', label: 'פניות'},
    { column: 'comments', label: 'הערות'}
  ];
  constructor(public dialog: MatDialog, route: ActivatedRoute,
              notificationService: NotificationService,
              private feedbackService: FeedbackService,
              private selectUnitService: SelectUnitService) {
    super(route, notificationService);
    this.searchCriteria['salaryYear'] = this.year;
  }

  ngOnInit() {
    this.sub.add(this.selectUnitService.unitSubject.subscribe(() => this.fetchItems()));
    super.ngOnInit();
  }


  fetchItems() {
    const organizationId = this.selectUnitService.currentOrganizationID;
    const employerId = this.selectUnitService.currentEmployerID;
    const departmentId = this.selectUnitService.currentDepartmentID;

    if (departmentId !== 0) {
      this.searchCriteria['departmentId'] = departmentId;
      this.searchCriteria['employerId'] = employerId;
      this.searchCriteria['organizationId'] = organizationId;
      this.feedbackService.searchEmployeeData(this.searchCriteria).then(response => {
        this.setItems(response);
      });
    }else { this.notificationService.warning('יש לבחור מחלקה'); }
  }

  openApplicationDialog(item: any): void {
    this.dialog.open(SendApplicationComponent, {
      data: item,
      width: '1350px',
      height: '680px'
    });
  }

  toggleExtraSearch(): void {
    this.extraSearchCriteria = (this.extraSearchCriteria === 'active') ? 'inactive' : 'active';
  }

  openInquiresDialog(item: any): void {
    this.dialog.open(InquiryFormComponent, {
      data: {'id': item.id, 'contentType': 'monthlytransferblock',
        'employerId': this.selectUnitService.currentEmployerID, 'companyId': item.company_id,
        'file_name': '', 'product_code': item.product_code,
        'product_type': item.product_type, 'employee_id': item.personal_id, 'employee_name': item.name},
      width: '550px',
    });
  }

  openCommentsDialog(id: number): void {
    this.dialog.open(CommentsFormComponent, {
      data: {'id': id, 'contentType': 'monthlytransferblock'},
      width: '550px',
    });
  }

  openInquiriesDetailsDialog(id: number): void {
    this.dialog.open(InquiriesComponent, {
      data: {'id': id, 'contentType': 'monthlytransferblock'},
      width: '860px',
    });
  }

  valueDateChange(keyCode: Date, val: string): void {
    this.searchCriteria[val] =
      formatDate(keyCode, 'yyyy-MM-dd', 'en-US', '+0530').toString();
    this.search();
  }

  myResetSearch(): void {
    this.resetSearch();
    this.searchCriteria['salaryYear'] = this.year;
  }
}
