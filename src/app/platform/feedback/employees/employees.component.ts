import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { DataTableComponent } from 'app/shared/data-table-1/data-table.component';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { NotificationService } from 'app/shared/_services/notification.service';

import { SendApplicationComponent } from './send-application/send-application.component';
import { InquiryFormComponent } from 'app/shared/_dialogs/inquiry-form/inquiry-form.component';
import { CommentsFormComponent } from 'app/shared/_dialogs/comments-form/comments-form.component';
import { InquiriesComponent } from 'app/shared/_dialogs/inquiries/inquiries.component';

import { ProductType } from 'app/shared/_models/product.model';
import { Status } from 'app/shared/_models/employee-feedback.model';
import { placeholder, slideToggle } from 'app/shared/_animations/animation';
import { MONTHS } from '../../../shared/_const/months';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css', '../../../shared/data-table/data-table.component.css'],
  providers: [MatDialog, FeedbackService],
  animations: [ slideToggle, placeholder]
})

export class EmployeesComponent implements OnInit , OnDestroy {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  sub = new Subscription();
  year = (new Date()).getFullYear();
  years = [ this.year, (this.year - 1) , (this.year - 2), (this.year - 3)];
  months = MONTHS;
  statuses = Status;
  statusLabel = Object.keys(Status).map(function(e) {
      return { id: e, name: Status[e] };
  });
  extraSearchCriteria = 'inactive';
  selectProductType = Object.keys(ProductType).map(function(e) {
    return { id: e, name: ProductType[e] };
  });
  productTypes = ProductType;

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
    { name: 'send_request', label: 'שלח פנייה', searchable: false},
    { name: 'inquiries', label: 'פניות', searchable: false},
    { name: 'comments', label: 'הערות', searchable: false}
  ];
  constructor(public dialog: MatDialog, route: ActivatedRoute,
              private notificationService: NotificationService,
              private feedbackService: FeedbackService,
              private selectUnitService: SelectUnitService) {
  }

  ngOnInit() {
    this.sub.add(this.selectUnitService.unitSubject.subscribe(() => this.fetchItems()));
  }


  fetchItems() {
    const organizationId = this.selectUnitService.currentOrganizationID;
    const employerId = this.selectUnitService.currentEmployerID;
    const departmentId = this.selectUnitService.currentDepartmentID;

    if (departmentId !== 0) {
      this.dataTable.criteria.filters['employerId'] = employerId;
      this.dataTable.criteria.filters['organizationId'] = organizationId;
      this.dataTable.criteria.filters['departmentId'] = departmentId;
      this.dataTable.criteria.filters['salaryYear'] = this.year;
      this.feedbackService.searchEmployeeData(this.dataTable.criteria).then(response => {
        this.dataTable.setItems(response);
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

  // valueDateChange(keyCode: Date, val: string): void {
  //   this.searchCriteria[val] =
  //     formatDate(keyCode, 'yyyy-MM-dd', 'en-US', '+0530').toString();
  //   this.search();
  // }

  // myResetSearch(): void {
  //   this.resetSearch();
  //   this.dataTable.criteria.filters['salaryYear'] = this.year;
  // }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
