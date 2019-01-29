import { Component, OnInit } from '@angular/core';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { MatDialog } from '@angular/material';
import { SendApplicationComponent } from './send-application/send-application.component';
import { Month } from 'app/shared/_const/month-bd-select';
import {GeneralHttpService} from 'app/shared/_services/http/general-http.service';

export interface DialogData {
  placeholder: string;
}

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  providers: [MatDialog, GeneralHttpService]
})
export class EmployeesComponent implements OnInit {


  readonly years = [2016, 2017, 2018, 2019];
  monthSearch;
  yearSearch;
  months = Month;
  employerData;


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
  constructor(public dialog: MatDialog,
              private generalHttpService: GeneralHttpService) { }

  ngOnInit() {
  }

  openApplicationDialog(): void {
    const dialogRef = this.dialog.open(SendApplicationComponent, {
      width: '1350px',
      height: '680px'
    });
  }

  httpTest() {
    this.generalHttpService.getEmployeeData(6).then(
      response => {
        this.employerData = response;
        console.log(this.employerData);
      }
    );
  }
}
