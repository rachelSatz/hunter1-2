import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { SendFileEmailComponent } from './send-file-email/send-file-email.component';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ActivatedRoute } from '@angular/router';
import { EmailComponent } from './email/email.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styles: ['.thborder { border-bottom: 2px solid #dee2e6 }' ],
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
  ]
})
export class PaymentComponent implements OnInit {

  constructor( private dialog: MatDialog,
               private  processService: ProcessService,
               private route: ActivatedRoute,
               private router: Router,
               ) {}


  processID;
  employer;
  department;
  processName;
  companyCode;
  month;
  sumPayment;
  files;
  recordNumber;
  status;
  date;

  data;
  fileId = 1;
  pageNumber = 2;
  email: string;
  record: boolean;
  file: boolean;

  ngOnInit() {
  }

  openDialog(): void {
    this.processService.getEmailUser().then( response => {
      this.email = response['email'];
      this.dialog.open(EmailComponent, {
        data: this.email,
        width: '550px',
        panelClass: 'email-dialog'
      });
    });

  }

  openDialogSendFileEmail(): void {
    this.dialog.open(SendFileEmailComponent, {
      width: '550px',
      panelClass: 'send-email-dialog'
    });
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

  nav() {
    const fileData = [true];
    this.router.navigate(['./broadcast'], { relativeTo: this.route, queryParams: {fileData}});
  }
}
