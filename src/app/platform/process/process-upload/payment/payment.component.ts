import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { startWith, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';

import { SendFileEmailComponent } from 'app/platform/process/process-upload/payment/send-file-email/send-file-email.component';
import { GroupHistoryComponent } from 'app/platform/process/process-upload/payment/group-history/group-history.component';
import { InformationMessageComponent } from './information-message/information-message.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { ProcessDetails } from 'app/shared/_models/process-details.model';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { Process } from 'app/shared/_models/process.model';
import { EmailComponent } from './email/email.component';
import { fade } from 'app/shared/_animations/animation';
import { DataTableResponse } from 'app/shared/data-table/classes/data-table-response';
import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styles: ['.thborder { border-bottom: 2px solid #dee2e6 }' ],
  animations: [ fade ]
 })

export class PaymentComponent implements OnInit , OnDestroy {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  constructor(private dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,
              private processService: ProcessService,
              private monthlyService: MonthlyTransferBlockService,
              public  processDataService: ProcessDataService,
              private notificationService: NotificationService,
              private helpers: HelpersService,
              public selectUnitService: SelectUnitService) {}

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
  subscription = new Subscription;
  organizationId: number;
  showInfoMessage = true;
  planId;

  ngOnInit() {
    const page = this.route.snapshot.queryParams['page'];
    this.planId = this.route.snapshot.queryParams['planId'];
    if (page)  {
      this.pageNumber = this.route.snapshot.queryParams['page'];
    }
    this.organizationId = this.selectUnitService.currentOrganizationID;
    if (this.processDataService.activeProcess !== undefined) {
      this.selectUnitService.setProcessData(this.processDataService);
    } else {
      this.processDataService = this.selectUnitService.getProcessData();
    }
    this.process_details = new ProcessDetails;
    if (this.processDataService.activeProcess && this.processDataService.activeProcess.pageNumber === 3) {
      this.pageNumber = 2;
    }
    this.processId = this.route.snapshot.params['id'];
    this.processDataService.activeProcess.pageNumber = 2;
    if (this.processDataService.activeProcess.status === 'can_be_processed' ||
      this.processDataService.activeProcess.status === 'done_processing') {
      this.processService.getUploadFileDone(this.processId).then( response => this.set_process(response));
    } else {
      this.sub = this.inter.pipe(
        startWith(0),
        switchMap(() => this.processService.getUploadFile(this.processId))
      ).subscribe(response => {
        this.set_process(response);
      });
    }
    this.subscription.add(this.selectUnitService.unitSubject.subscribe(() => this.fetchItems()));
    this.pageNumber = this.route.snapshot.queryParams['page'] ? this.route.snapshot.queryParams['page'] : this.pageNumber;
  }

  fetchItems() {
    if (this.organizationId !== this.selectUnitService.currentOrganizationID) {
      this.router.navigate(['/platform', 'process', 'table']);
    }
  }

  set_process(response): void {
    this.process_details = response;
    if (this.process_details.status !== null) {
      switch (this.process_details.status) {
        case 'partially_transmitted':
        case 'can_be_processed':
        case 'transmitted': {
          this.helpers.setPageSpinner(false);
          this.process_percent = 100;
          let time = 1000;
          if (this.processDataService.activeProcess.returnDetails) {
            time = 0;
          }
          this.openDialogGroupHistory();
          setTimeout(() => {
            this.pageNumber = 2;
            this.processDataService.activeProcess.pageNumber = 3;
            this.pageNumber = this.route.snapshot.queryParams['page'] ? 3 : 2;

            this.sub.unsubscribe();
            }, time);

          break;
        }
        case 'loading': {
          this.helpers.setPageSpinner(true);
          if (this.process_details.percent > 0 && this.showInfoMessage) {
            this.openInformationMessage();
            this.showInfoMessage = false;
          }
          this.process_percent = this.process_details.percent;
          break;
        }
        case 'error_loading': {
          this.helpers.setPageSpinner(false);
          this.notificationService.error('אירעה שגיאה בהעלאת הקובץ');
          this.sub.unsubscribe();
          break;
        }
        case 'done_processing': {
          this.helpers.setPageSpinner(false);
          this.pageNumber = 2;
          this.sub.unsubscribe();
          break;
        }
        case 'loaded_with_errors': {
          this.helpers.setPageSpinner(false);
          this.pageNumber = 4;
          if (this.processDataService.activeProcess !== undefined) {
            this.processDataService.activeProcess.incorrect = true;
            this.selectUnitService.setProcessData(this.processDataService);
          }
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

  openDialogGroupHistory():  void {
    this.helpers.setPageSpinner(true);
    this.monthlyService.groupHistory(this.processId).then(
      res =>  {
        this.helpers.setPageSpinner(false);
        if (res && res.length > 0) {
          this.dialog.open(GroupHistoryComponent, {
            data: {'processId' : this.processId , items: res},
            width: '1000px',
          });
        }
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
      data: {processId : this.processId, employerId : this.process_details.employer_id, planId : this.planId},
      width: '550px',
      panelClass: 'send-email-dialog'
    });
  }

  downloadPaymentsInstruction(): void {
    this.processService.downloadPaymentsInstruction(this.processId, this.planId).then(response => {
      response.forEach(function (value) {
        const byteCharacters = atob(value['data']);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: 'application/' + value['ext']});
        FileSaver.saveAs(blob, value['filename']);
      });

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
        if (this.processDataService.activeProcess !== undefined) {
          this.processDataService.activeProcess.returnDetails = true;
          this.processDataService.activeProcess.incorrect = false;
          this.selectUnitService.setProcessData(this.processDataService);
        }
        this.router.navigate(['/platform', 'process', 'new', 1, 'details', 'files']);
        break;
      }
      case 'detailed-records':
      case 'detailed-records-incorrect': {
        this.processDataService.activeProcess.returnDetails = true;
        this.processDataService.activeProcess.incorrect = page === 'detailed-records-incorrect' ? true : false;
        this.router.navigate(['/platform', 'process', 'new', 1, 'details', 'records']);
      }
    }
  }

  setApprovalFile(): void {
    this.processService.setApprovalFile(this.processDataService.activeProcess.processID).then( response => response);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.subscription.unsubscribe();

  }

}
