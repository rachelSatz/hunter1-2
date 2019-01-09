import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material';
import {DateUpdateComponent} from './date-update/date-update.component';
import { ProcessService } from 'app/shared/_services/http/process.service';



@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.css'],
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        opacity: '0'
      })),
      state('active', style({
        display: 'block',
        opacity: '1'
      })),
      transition('active => inactive', animate('0ms ease-in')),
      transition('inactive => active', animate('300ms ease-in'))
    ])
  ],
  providers: [ProcessService]
})
export class BroadcastComponent implements OnInit {

  pageNumber = 1;
  valid: boolean;
  isRefund = false;
  employer;
  department;
  processID = 1;
  companyCode;
  month;
  processName;
  date;
  sumPayment;
  files;
  recordNumber;
  status;


  constructor(private dialog: MatDialog, private processService: ProcessService) {}

  ngOnInit() {

  }

  dateUpdate() {
    const dialogRef = this.dialog.open(DateUpdateComponent, {
      height: '230px',
      width: '550px',
    });
    dialogRef.afterClosed().subscribe(
      data => console.log(data)
    );
  }

  getData() {
    this.processService.getUploadFile(this.processID)
      .then(response => {
        switch (response['status']) {
          case 'Loading': {

          }
            break;
          case ('Error_Loading'): {

          }
        }
        if (response['status']) {}
        this.employer = response['employer_name'];
        this.department = response['department_name'];
        this.processName = response['name'];

        this.companyCode = response['company_code'];
        this.month = response['month'];

        this.sumPayment = response['total']
        this.files = response['groups_count'];
        this.recordNumber = response['record_count'];

        this.status = response['status'];
        this.date = response['date'];
        this.employer = response['name'];
      } );
  }

  Refund() {
    this.pageNumber = 1;
    this.isRefund = true;
  }

}
