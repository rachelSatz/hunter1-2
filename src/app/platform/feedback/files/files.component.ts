import { Component, OnDestroy, OnInit} from '@angular/core';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { NotificationService } from 'app/shared/_services/notification.service';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { InquiryFormComponent} from 'app/shared/_dialogs/inquiry-form/inquiry-form.component';
import { CommentsFormComponent } from 'app/shared/_dialogs/comments-form/comments-form.component';
import { Subscription } from 'rxjs';

import { Month } from 'app/shared/_const/month-bd-select';
import { FormComponent } from './form/form.component';
import { ProductType } from 'app/shared/_models/product.model';
import { InquiriesComponent} from 'app/shared/_dialogs/inquiries/inquiries.component';
import { placeholder, slideToggle } from 'app/shared/_animations/animation';
import { Status } from 'app/shared/_models/file-feedback.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css'],
  animations: [ slideToggle, placeholder ]
})
export class FilesComponent extends DataTableComponent implements OnInit, OnDestroy  {

  sub = new Subscription();
  fileData;
  extraSearchCriteria = 'inactive';
  departmentId;
  year = (new Date()).getFullYear();
  years = [ this.year, (this.year - 1) , (this.year - 2), (this.year - 3)];
  months = Month;
  statuses = Status;

  list_status = Object.keys(Status).map(function(e) {
    return { id: e, name: Status[e] };
  });
  selectProductType = Object.keys(ProductType).map(function(e) {
    return { id: e, name: ProductType[e] };
  });
  readonly headers: DataTableHeader[] = [
    {column: 'company_name', label: 'חברה מנהלת'},
    {column: 'employer_name', label: 'שם מעסיק'},
    {column: 'amount', label: 'סכום'},
    {column: 'code', label: 'קוד אוצר'},
    // {column: 'date', label: 'תאריך שידור'},
    // {column: 'last_update', label: 'תאריך עדכון אחרון'},
    {column: 'status', label: 'סטטוס'},
    {column: 'more', label: 'מידע נוסף'},
    {column: 'send_request', label: 'שלח פנייה'},
    {column: 'inquiries', label: 'פניות'},
    {column: 'comments', label: 'הערות'}

  ];


  constructor(route: ActivatedRoute, private router: Router,
              protected notificationService: NotificationService,
              private dialog: MatDialog, private feedbackService: FeedbackService,
              private selectUnit: SelectUnitService) {
    super(route, notificationService);
    this.searchCriteria['deposit_year'] = this.year;
  }

  ngOnInit() {
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => this.fetchItems()));

    super.ngOnInit();
  }

  fetchItems() {
    const organizationId = this.selectUnit.currentOrganizationID;
    const employerId = this.selectUnit.currentEmployerID;
    const departmentId = this.selectUnit.currentDepartmentID;

    if (departmentId !== 0) {
      this.searchCriteria['departmentId'] = departmentId;
      this.searchCriteria['employerId'] = employerId;
      this.searchCriteria['organizationId'] = organizationId;
      this.feedbackService.getFileFeedbacks( this.searchCriteria)
        .then(response => {
          this.setItems(response);
          this.fileData = response;
        });
    }else {
      this.notificationService.warning('יש לבחור מחלקה');
    }
  }

  toggleExtraSearch(): void {
    this.extraSearchCriteria = (this.extraSearchCriteria === 'active') ? 'inactive' : 'active';
  }
  openFormDialog(item: any): void {
    this.dialog.open(FormComponent, {
      width: '1350px',
      height: '500px',
      data:  item,
    });
  }

  openInquiresDialog(item: any): void {
    this.dialog.open(InquiryFormComponent, {
      data: {'id': item.id, 'contentType': 'groupthing', 'employerId': this.selectUnit.currentEmployerID,
        'companyId': item.company_id, 'file_name': item.file_name, 'product_code': item.product_code,
        'product_name': item.product_name},
      width: '550px',
    });
  }

  openCommentsDialog(id: number): void {
     this.dialog.open(CommentsFormComponent, {
      data: {'id': id, 'contentType': 'groupthing'},
      width: '550px',
    });
  }

  openInquiriesDetailsDialog(id: number): void {
    this.dialog.open(InquiriesComponent, {
      data: {'id': id, 'contentType': 'groupthing'},
      width: '860px',
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.sub.unsubscribe();
  }

  myResetSearch(): void {
    this.resetSearch();
    this.searchCriteria['deposit_year'] = this.year;
  }

  valueDateChange(keyCode: Date, val: string): void {
    this.searchCriteria[val] =
      formatDate(keyCode, 'yyyy-MM-dd', 'en-US', '+0530').toString();
    this.search();
  }


}
