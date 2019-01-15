import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

import { SendFileEmailComponent } from './send-file-email/send-file-email.component';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { EmailComponent } from './email/email.component';
import { Router } from '@angular/router';
import { ProcessDetails } from 'app/shared/_models/process-details.model';
import * as FileSaver from 'file-saver';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { NotificationService } from 'app/shared/_services/notification.service';


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
  ]})
export class PaymentComponent implements OnInit {

  constructor(private dialog: MatDialog, private route: ActivatedRoute,
              private router: Router, private processService: ProcessService,
              public  processDataService: ProcessDataService,
              protected notificationService: NotificationService) {}

  data;
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

  ngOnInit() {

    this.processId = this.processDataService.activeProcess.processID || 0;

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
                this.notificationService.error('אירעה שגיאה בהעלאת הקובץ');
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

  openDialogSendFileEmail(): void {
    this.dialog.open(SendFileEmailComponent, {
      width: '550px',
      panelClass: 'send-email-dialog'
    });
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

  setPage(page) {
    switch (page) {
      case 'new': {
        this.router.navigate(['/platform', 'process', 'new'], { relativeTo: this.route });
        break;
      }
      case 'broadcast': {
        this.router.navigate(['/platform', 'process', 'new', 'broadcast']);
        break;
      }
      case 'payment': {
        this.pageNumber -= 1;
        break;
      }
      case 'home': {
        this.router.navigate(['platform', 'dashboard']);
        break;
      }
      case 'success': {
        this.pageNumber = 2;
        this.record = false;
        this.file = false;
      }
    }
  }
}
