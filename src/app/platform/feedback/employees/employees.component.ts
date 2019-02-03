import { Component, OnInit } from '@angular/core';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { MatDialog } from '@angular/material';
import { SendApplicationComponent } from './send-application/send-application.component';

import { Month } from 'app/shared/_const/month-bd-select';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'app/shared/_services/notification.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ProductType } from 'app/shared/_models/product.model';
import { StatusLabel } from 'app/shared/_models/employee-feedback.model';
import { InquiryFormComponent } from '../shared/inquiry-form/inquiry-form.component';
import { CommentsFormComponent } from '../shared/comments-form/comments-form.component';
import { FormComponent } from '../files/form/form.component';

export interface DialogData {
  placeholder: string;
}

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css', '../../../shared/data-table/data-table.component.css'],
  providers: [MatDialog, FeedbackService],
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

export class EmployeesComponent extends DataTableComponent implements OnInit {

  departmentId;
  readonly years = [2016, 2017, 2018, 2019];
  months = Month;
  statusLabel = Object.keys(StatusLabel).map(function(e) {
    return { id: e, name: StatusLabel[e] };
  });
  employeeData: any;
  extraSearchCriteria = 'inactive';
  selectProductType = Object.keys(ProductType).map(function(e) {
    return { id: e, name: ProductType[e] };
  });


  readonly headers: DataTableHeader[] =  [
    { column: '', label: 'עובד' },
    { column: 'process_name', label: 'ת"ז' },
    { column: 'employer_name', label: 'חודש שכר' },
    { column: 'code', label: 'חברה מנהלת' },
    { column: 'date', label: 'סוג מוצר' },
    { column: 'amount', label: 'קוד אוצר' },
    { column: 'status', label: 'סכום' },
    { column: 'download', label: 'גורם מטפל' },
    { column: 'amount', label: 'תאריך יצירת הפניה' },
    { column: 'status', label: 'תאריך עדכון אחרון' },
    { column: 'status', label: 'סטטוס' },
    { column: 'download', label: 'סטטוס פנייה' },
    { column: 'more', label: 'מידע נוסף'},
    { column: 'send_request', label: 'שלח פנייה'},
    { column: 'comments', label: 'הערות'}
  ];
  constructor(public dialog: MatDialog, route: ActivatedRoute, notificationService: NotificationService,
              private feedbackService: FeedbackService, private selectUnitService: SelectUnitService) {
    super(route, notificationService);
  }

  ngOnInit() {
    this.departmentId = this.selectUnitService.currentDepartmentID;
    this.fetchItems();
    super.ngOnInit();
  }

  openApplicationDialog(): void {
    const dialogRef = this.dialog.open(SendApplicationComponent, {
      width: '1350px',
      height: '680px'
    });
  }

  toggleExtraSearch(): void {
    this.extraSearchCriteria = (this.extraSearchCriteria === 'active') ? 'inactive' : 'active';
  }


  fetchItems(): void {
    console.log(this.searchCriteria + ' searchCriteria');
    this.feedbackService.searchEmployeeData(6, this.searchCriteria).then(response => {
      this.setItems(response);
      this.employeeData = response;
    });

  }

  openInquiresDialog(): void {
    this.dialog.open(InquiryFormComponent, {
      data: {'id': 1, 'contentType': 'monthlytransferblock', 'employerId': 4, 'companyId': 5},
      width: '550px',
      panelClass: 'dialog-file'
    });
  }

  openCommentsDialog(): void {
    this.dialog.open(CommentsFormComponent, {
      data: {'id': 1, 'contentType': 'groupthing'},
      width: '550px',
      panelClass: 'dialog-file'
    });
  }

}
