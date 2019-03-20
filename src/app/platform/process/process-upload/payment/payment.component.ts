import { Component, OnDestroy, OnInit } from '@angular/core';
import { startWith, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';

import { SendFileEmailComponent } from './send-file-email/send-file-email.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ProcessDetails } from 'app/shared/_models/process-details.model';
import { Process } from 'app/shared/_models/process.model';
import { EmailComponent } from './email/email.component';
import { fade } from 'app/shared/_animations/animation';
import {InformationMessageComponent} from './information-message/information-message.component';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styles: ['.thborder { border-bottom: 2px solid #dee2e6 }' ],
  animations: [ fade ]
 })

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
  showInfoMessage = true;

  ngOnInit() {
    this.process_details = new ProcessDetails;
    if (this.processDataService.activeProcess.pageNumber === 3) {
      this.pageNumber = 2;
    }
   this.processId = this.route.snapshot.params['id'];


    this.processDataService.activeProcess.pageNumber = 2;

    if (this.processDataService.activeProcess.status === 'can_be_processed' ||
      this.processDataService.activeProcess.status === 'done_processing') {
      this.processService.getUploadFileDone(this.processId).then( response => this.set_process(response));
    }else {
      this.sub = this.inter.pipe(
        startWith(0),
        switchMap(() => this.processService.getUploadFile(this.processId))
      ).subscribe(response => {
        this.set_process(response);
      });
    }
  }

  set_process(response): void {
    this.process_details = response;
    if (this.process_details.status !== null) {
      switch (this.process_details.status) {
        case 'can_be_processed': {
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
        case 'loading': {
          if (this.process_details.percent > 0 && this.showInfoMessage) {
            this.openInformationMessage();
            this.showInfoMessage = false;
          }
          this.process_percent = this.process_details.percent;
          break;
        }
        case 'error_loading': {
          this.notificationService.error('אירעה שגיאה בהעלאת הקובץ');
          this.sub.unsubscribe();
          break;
        }
        case 'done_processing': {
          this.pageNumber = 2;
          this.sub.unsubscribe();
          break;
        }
      }
    }
  }

  openInformationMessage(): void {
    this.dialog.open(InformationMessageComponent, {
      data: this.processId,
      width: '550px',
      panelClass: 'information-message'
    });
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
      data: {processId : this.processId},
      width: '550px',
      panelClass: 'send-email-dialog'
    });
  }

  downloadMasav(): void {
    this.processService.downloadMasav(this.processId).then(response => {
      const byteCharacters = atob(response['data']);
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

  downloadExcel(): void {
    this.processService.downloadExcel(this.processId).then(response => {
      const byteCharacters = atob(response['data']);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'application/' + 'xlsx'});
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
      case 'detailed-records': {
        this.processDataService.activeProcess.returnDetails = true;
        this.router.navigate(['/platform', 'process', 'new', 1, 'details']);
      }
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
