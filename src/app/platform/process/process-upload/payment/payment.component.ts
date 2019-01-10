import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

import { SendFileEmailComponent } from './send-file-email/send-file-email.component';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { EmailComponent } from './email/email.component';
import { Router } from '@angular/router';
import { ProcessDetails } from 'app/shared/_models/process-details.model';
import * as FileSaver from 'file-saver';
import {ViewProcess} from '../../../../shared/_models/process.model';



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
               private activatedRoute: ActivatedRoute,
               private router: Router,
               ) {}



  data;
  // fileId = 1;
  process_percent = 0;
  processId;
  email: string;
  name = 'someone';
  pageNumber = 2;
  process_details: ProcessDetails;
  spin: boolean;
  fileName: string;
  type: string;
  record: boolean;
  file: boolean;
  viewProcess: ViewProcess[];


  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      this.processId = params['processId'] || 0;
      this.data = params;

    });

    this.processService.getUploadFile(this.processId)
      .then(response => {
        this.process_details = response;
          if (this.process_details.status !== null) {
            switch (this.process_details.status) {
              case 'Progressing': {
                this.process_percent = 100;
                setTimeout(() => {
                  this.pageNumber = 2;
                }, 2000);
                break;
              }
              case 'Loading': {
                this.process_percent = this.process_details.percent;
                break;
              }
              case 'Error_Loading': {
                this.openErrorDialog();
                break;
              }
              default: {
                break;
              }
            }
          }
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


  openErrorDialog(): void {
    this.dialog.open(ErrorMessageComponent, {
      width: '550px'
      // panelClass: 'email-dialog'
    });
  }


  openDialogSendFileEmail(): void {
    this.dialog.open(SendFileEmailComponent, {
      width: '550px',
      panelClass: 'send-email-dialog'
    });
  }



  goToHomePage() {
    this.router.navigate(['platform', 'dashboard']);
  }
  goToPreviousPage() {
    this.pageNumber = 2;
  }

  // setPage(index: number): void {
  //   // this.pageNumber += index;
  //   this.router.navigate(['./broadcast'], { relativeTo: this.activatedRoute,
  //     queryParams: {queryParams: this.data }} );
  // }


  changePage(isForword: boolean) {
    if (isForword) {
      this.router.navigate(['./broadcast'], { relativeTo: this.activatedRoute,
        queryParams: {queryParams: this.data }} );
    } else {
      this.router.navigate(['./payment'], { relativeTo: this.activatedRoute,
      queryParams: {queryParams: this.data }} );
  }

  }

  downloadMasav(): void {
    this.processService.downloadMasav().then(response => {
      const byteCharacters = atob(response);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'application/' + this.type});
      FileSaver.saveAs(blob, this.fileName);
      this.spin = false;
    });
  }

  recordeDetails(): void {
    this.processService.getFilesList(this.processId)
      .then(response => {
        this.viewProcess = response;
      });
  }
}
