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
import { EmployeeFeedback } from 'app/shared/_models/employee-feedback.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ProductType } from 'app/shared/_models/product.model';
import { StatusLabel } from 'app/shared/_models/employee-feedback.model';

export interface DialogData {
  placeholder: string;
}

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
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

export class EmployeesComponent  extends DataTableComponent implements OnInit {


  readonly years = [2016, 2017, 2018, 2019];
  monthSearch;
  yearSearch;
  months = Month;
  statusLabel = Object.keys(StatusLabel).map(function(e) {
    return { id: e, name: StatusLabel[e] };
  });
  employeeData = new EmployeeFeedback;
  extraSearchCriteria = 'inactive';
  selectProductType = Object.keys(ProductType).map(function(e) {
    return { id: e, name: ProductType[e] };
  });


  readonly headers: DataTableHeader[] =  [
    { column: '', label: 'עובד' },
    { column: 'process_name', label: 'ת"ז' },
    { column: 'employer_name', label: 'חודש שכר' },
    { column: 'month', label: 'חודש הפרשה' },
    { column: 'amount', label: 'שכר' },
    { column: 'code', label: 'חברה מנהלת' },
    { column: 'date', label: 'סוג מוצר' },
    { column: 'amount', label: 'קוד אוצר' },
    { column: 'status', label: 'סכום' },
    { column: 'download', label: 'גורם מטפל' },
    { column: 'amount', label: 'תאריך יצירת הפניה' },
    { column: 'status', label: 'תאריך עדכון אחרון' },
    { column: 'status', label: 'סטטוס' },
    { column: 'download', label: 'סטטוס פנייה' }
  ];
  constructor(public dialog: MatDialog, route: ActivatedRoute, notificationService: NotificationService,
              private feedbackService: FeedbackService, private selectUnitService: SelectUnitService) {
    super(route, notificationService);
  }

  ngOnInit() {
    console.log(this.statusLabel);
    // this.feedbackService.getEmployeeData(this.selectUnitService.currentDepartmentID).then(
    this.feedbackService.getEmployeeData(6).then(
      response => {
        this.employeeData = response;
        console.log(this.employeeData[0]);
      }
    );
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

}
