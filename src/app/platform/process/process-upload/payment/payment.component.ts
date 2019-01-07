import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { SendFileEmailComponent } from './send-file-email/send-file-email.component';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { EmailComponent } from './email/email.component';

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

  constructor( public router: Router, private dialog: MatDialog, private  processService: ProcessService) {}

  fileId = 1;
  pageNumber = 1;
  email: string;

  ngOnInit() {


    this.processService.getUploadFile(this.fileId)
      .then(() => {
      });
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

}
