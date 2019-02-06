import { Component, OnDestroy, OnInit} from '@angular/core';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { NotificationService } from 'app/shared/_services/notification.service';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';

import { InquiryFormComponent} from '../shared/inquiry-form/inquiry-form.component';
import { CommentsFormComponent } from '../shared/comments-form/comments-form.component';
import { Subscription } from 'rxjs';
import { Month } from 'app/shared/_const/month-bd-select';
import { FormComponent } from './form/form.component';
import { StatusLabel } from 'app/shared/_models/employee-feedback.model';
import { ProductType } from 'app/shared/_models/product.model';
import { InquiriesComponent} from '../shared/inquiries/inquiries.component';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css'],
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
export class FilesComponent extends DataTableComponent implements OnInit, OnDestroy  {

  sub = new Subscription();
  fileData;
  extraSearchCriteria = 'inactive';
  departmentId;
  readonly years = [2016, 2017, 2018, 2019];
  months = Month;

  statusLabel = Object.keys(StatusLabel).map(function(e) {
    return { id: e, name: StatusLabel[e] };
  });
  selectProductType = Object.keys(ProductType).map(function(e) {
    return { id: e, name: ProductType[e] };
  });
  readonly headers: DataTableHeader[] = [
    {column: 'company_name', label: 'חברה מנהלת'},
    {column: 'employer_name', label: 'שם מעסיק'},
    // {column: 'month', label: 'חודש שכר'},
    {column: 'amount', label: 'סכום'},
    {column: 'code', label: 'קוד אוצר'},
    // {column: 'date', label: 'תאריך שידור'},
    // {column: 'inquiry_created_at', label: 'תאריך יצירת הפנייה'},
    // {column: 'last_update', label: 'תאריך עדכון אחרון'},
    {column: 'status', label: 'סטטוס'},
    // {column: 'inquiry_status', label: 'סטטוס פנייה'},
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
  }

  ngOnInit() {
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => this.fetchItems()));

    super.ngOnInit();
  }

  fetchItems(): void {
    const organizationId = this.selectUnit.currentOrganizationID;
    const employerId = this.selectUnit.currentEmployerID;
    const departmentId = this.selectUnit.currentDepartmentID;

    if (organizationId) {
      this.searchCriteria['departmentId'] = departmentId;
      this.searchCriteria['employerId'] = employerId;
      this.searchCriteria['organizationId'] = organizationId;
      this.feedbackService.getFileFeedbacks(this.selectUnit.currentDepartmentID)
        .then(response => {
          this.setItems(response);
          this.fileData = response;
        });
    }
  }

  toggleExtraSearch(): void {
    this.extraSearchCriteria = (this.extraSearchCriteria === 'active') ? 'inactive' : 'active';
  }
  openFormDialog(item: any): void {
    this.dialog.open(FormComponent, {
      width: '1350px',
      height: '680px',
      data:  item,
      panelClass: 'dialog-file'
    });
  }

  openInquiresDialog(id: number): void {
    const dialog = this.dialog.open(InquiryFormComponent, {
      data: {'id': id, 'contentType': 'groupthing', 'employerId': this.searchCriteria['employerId'], 'companyId': 5},
      width: '550px',
      panelClass: 'dialog-file'
    });
    this.sub.add(dialog.afterClosed().subscribe(() => {
      this.fetchItems();
    }));
  }

  openCommentsDialog(id: number): void {
    const dialog = this.dialog.open(CommentsFormComponent, {
      data: {'id': id, 'contentType': 'groupthing'},
      width: '550px',
      panelClass: 'dialog-file'
    });
    this.sub.add(dialog.afterClosed().subscribe(() => {
      this.fetchItems();
    }));
  }

  openInquiriesDetailsDialog(id: number): void {
    const dialog = this.dialog.open(InquiriesComponent, {
      data: {'id': id, 'contentType': 'groupthing'},
      width: '550px',
      panelClass: 'dialog-file'
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.sub.unsubscribe();
  }

}
