import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

import { SendFileEmailComponent } from './send-file-email/send-file-email.component';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { EmailComponent } from './email/email.component';
import { Router } from '@angular/router';
import { ProcessDetails } from 'app/shared/_models/process-details.model';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { NotificationService } from 'app/shared/_services/notification.service';

import * as FileSaver from 'file-saver';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import {Process} from '../../../../shared/_models/process.model';


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

export class PaymentComponent implements OnInit , OnDestroy {

  constructor(private dialog: MatDialog, private route: ActivatedRoute,
              private router: Router, private processService: ProcessService,
              public  processDataService: ProcessDataService,
              private notificationService: NotificationService) {}

  data;
  process_percent = 0;
  processId;
  process: Process;
  email: string;
  name = '';
  pageNumber = 1;
  process_details: ProcessDetails;
  spin: boolean;
  fileName = 'masav-file';
  type = '.001';
  month;
  record: boolean;
  file: boolean;
  inter = <any>interval(5000);
  sub = new Subscription;

  ngOnInit() {
    this.process_details = new ProcessDetails;
    if (this.processDataService.activeProcess.pageNumber === 3) {
      this.pageNumber = 2;
    }
    // this.processId = this.processDataService.activeProcess.processID || 0;
   this.processId = this.route.snapshot.params['id'];


    this.processDataService.activeProcess.pageNumber = 2;



    this.sub = this.inter.pipe(
      startWith(0),
      switchMap(() => this.processService.getUploadFile(this.processId))
    ).subscribe(response => {
      this.set_process(response);
    });
    // this.month = this.process_details.date.slice(5 [7]) ;
  }

  set_process(response): void {
    this.process_details = response;
    console.log( this.process_details);
    if (this.process_details.status !== null) {
      switch (this.process_details.status) {
        case 'Can_Be_Processed': {
          this.process_percent = 100;
          let time = 1000;
          if (this.processDataService.activeProcess.returnDetails) {
            time = 0;
          }
          setTimeout(() => {
            this.pageNumber = 2;
            this.processDataService.activeProcess.pageNumber = 3;
            this.sub.unsubscribe();
            }, time);

          break;
        }
        case 'Loading': {
          this.process_percent = this.process_details.percent;
          break;
        }
        case 'Error_Loading': {
          this.notificationService.error('אירעה שגיאה בהעלאת הקובץ');
          this.sub.unsubscribe();
          break;
        }
        case 'Done_Processing': {
          this.pageNumber = 2;
          this.sub.unsubscribe();
          break;
        }
      }
    }
  }

  openDialog(): void {
    this.processService.getPaymentMailOnCompletion(this.processId).then( response => {
      this.email = response['email_address'];
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
    this.processService.downloadMasav(this.processId).then(response => {
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
        this.processDataService.activeProcess.pageNumber = 1;
        this.router.navigate(['/platform', 'process', 'new', 1], { relativeTo: this.route });
        break;
      }
      case 'broadcast': {
        this.router.navigate(['/platform', 'process', 'new', 1, 'broadcast']);
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
      // delete
      case 'success': {
        this.pageNumber = 2;
        this.record = false;
        this.file = false;
        break;
      }
      case 'detailed-files': {
        this.processDataService.activeProcess.returnDetails = true;
        const files = {name: 'file'};
        this.router.navigate(['/platform', 'process', 'new', 1, 'details'], {queryParams: files});
        break;
      }
      case 'details-records': {
        this.processDataService.activeProcess.returnDetails = true;
        this.router.navigate(['/platform', 'process', 'new', 1, 'details']);
      }
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
