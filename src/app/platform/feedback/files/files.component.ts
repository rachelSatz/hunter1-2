import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { DataTableComponent } from 'app/shared/data-table-1/data-table.component';
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
export class FilesComponent implements OnInit, OnDestroy  {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

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
  readonly columns = [
    {name: 'company_name', label: 'חברה מנהלת', searchable: false},
    {name: 'employer_name', label: 'שם מעסיק', searchable: false},
    {name: 'amount', label: 'סכום', searchable: false},
    {name: 'code', label: 'קוד אוצר', searchable: false},
    // {name: 'date', label: 'תאריך שידור', searchable: false},
    // {name: 'last_update', label: 'תאריך עדכון אחרון', searchable: false},
    {name: 'status', label: 'סטטוס', searchOptions: { labels: this.list_status } },
    {name: 'more', label: 'מידע נוסף', searchable: false},
    {name: 'send_request', label: 'שלח פנייה', searchable: false},
    {name: 'inquiries', label: 'פניות', searchable: false},
    {name: 'comments', label: 'הערות', searchable: false}
  ];


  constructor(route: ActivatedRoute, private router: Router,
              protected notificationService: NotificationService,
              private dialog: MatDialog,
              private feedbackService: FeedbackService,
              private selectUnit: SelectUnitService) {
  }

  ngOnInit() {
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => this.fetchItems()));
  }

  fetchItems() {
    const organizationId = this.selectUnit.currentOrganizationID;
    const employerId = this.selectUnit.currentEmployerID;
    const departmentId = this.selectUnit.currentDepartmentID;

    if (departmentId !== 0) {
      this.dataTable.criteria.filters['deposit_year'] = this.year;
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
    this.sub.unsubscribe();
  }

  // myResetSearch(): void {
  //   this.resetSearch();
  //   this.searchCriteria['deposit_year'] = this.year;
  // }

  // valueDateChange(keyCode: Date, val: string): void {
  //   this.searchCriteria[val] =
  //     formatDate(keyCode, 'yyyy-MM-dd', 'en-US', '+0530').toString();
  //   this.search();
  // }


}
