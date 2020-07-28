import { Component, OnDestroy, Input, OnInit } from '@angular/core';

import * as FileSaver from 'file-saver';
import { MatDialog } from '@angular/material';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { fade } from 'app/shared/_animations/animation';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { ProcessLoadingComponent } from 'app/platform/process/process-loading/process-loading.component';
import { Subscription } from 'rxjs';
import { DataTableCriteria } from 'app/shared/data-table/classes/data-table-criteria';
import { NotificationService } from 'app/shared/_services/notification.service';
import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';
import { GroupHistoryComponent } from 'app/platform/process/process-loading/payment-instructions/group-history/group-history.component';
import { SendFileEmailComponent } from 'app/shared/_dialogs/send-file-email/send-file-email.component';

@Component({
  selector: 'app-payment-instructions',
  templateUrl: './payment-instructions.component.html',
  styleUrls: ['./payment-instructions.component.css', './../../process-loading/process-loading.component.css'],
  animations: [ fade ]
})
export class PaymentInstructionsComponent implements OnInit, OnDestroy {

  sub = new Subscription;
  processId: number;
  hasShow: boolean;
  @Input() rows: DataTableCriteria;
  activeUrl = this.router.url.includes( 'records') ? 'records' : 'files';
  headers = [
    {label: 'מעקב ברמת קובץ',    url: 'files'  },
    {label: 'מעקב ברמת עובד',   url: 'records' },
  ];


  constructor(private router: Router,
              private route: ActivatedRoute,
              private selectUnit: SelectUnitService,
              private dialog: MatDialog,
              protected notificationService: NotificationService,
              private monthlyService: MonthlyTransferBlockService,
              public processLoading: ProcessLoadingComponent,
              public processDataService: ProcessDataService,
              private processService: ProcessService) {
  }


  ngOnInit() {
    if (this.processDataService.activeProcess === undefined) {
      this.processDataService = this.selectUnit.getProcessData();
    }
    const show = this.route.snapshot.queryParams['show'];
    this.hasShow = show !== undefined ? show === 'true' : this.hasShow;

    this.processId = this.processDataService.activeProcess.processID;
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.setActiveUrl(event.url);
      }
    });
    this.openDialogGroupHistory();
  }

  private setActiveUrl(url: string): void {
    this.activeUrl = url.indexOf('records') === -1 ? 'files' : 'records';
  }

  openDialogGroupHistory():  void {
    if (this.processDataService.activeProcess.status === 'can_be_processed' &&
      this.processDataService.activeProcess.type === 'positive') {
      this.monthlyService.groupHistory(this.processId).then(
        res => {
          if (res && res.length > 0) {
            this.dialog.open(GroupHistoryComponent, {
              data: {'processId': this.processId, items: res},
              width: '1000px',
            });
          }
        });
    }
  }


  downloadPaymentsInstruction(): void {
    if (this.checkedRowItems()) {
      const filesList = this.rows.checkedItems.map(item => item['file_id']);
      this.processService.downloadPaymentsInstruction(this.processId, filesList, this.rows).then(response => {
        this.processDataService.activeProcess.payment_instructions = true;
        this.processDataService.setProcess(this.processDataService.activeProcess);
        this.selectUnit.setProcessData(this.processDataService);
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
      });
    }
  }

  openDialogSendFileEmail(): void {
    if (this.checkedRowItems()) {
      const dialog = this.dialog.open(SendFileEmailComponent, {
        data: {processId: this.processId, employerId: this.selectUnit.currentEmployerID, criteria: this.rows},
        width: '450px',
        panelClass: 'send-email-dialog'
      });

      this.sub.add(dialog.afterClosed().subscribe(res => {
        if (res === 'Message_Sent') {
          this.processDataService.activeProcess.payment_instructions = true;
          this.processDataService.setProcess(this.processDataService.activeProcess);
          this.selectUnit.setProcessData(this.processDataService);

        }
      }));
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  checkedRowItems(): boolean {
    if (this.rows.checkedItems.length === 0 && !this.rows.isCheckAll) {
      this.notificationService.error('לא נבחרו רשומות', 'יש לסמן רשומות מהטבלה');
      return false;
    }
    return true;
  }

  setPage(): void {
    if (this.processDataService.activeProcess.payment_instructions || this.processDataService.activeProcess.type !== 'positive') {
      if (this.rows === undefined) {
        this.notificationService.warning('שים לב', 'עליך לבחור רשומות');
        return;
      }

      if (((this.rows.isCheckAll && this.rows.checkedItems.length > 0))
        || (!this.rows.isCheckAll && this.rows.checkedItems.length < this.processLoading.process_details.groups_count)) {
        const buttons = {confirmButtonText: 'המשך', cancelButtonText: 'ביטול'};
        this.notificationService.warning('שים לב',
          'לא כל הקופות מסומנות האם ברצונך לשדר חלקית?', buttons).then(confirmation => {
          if (confirmation.value) {
            this.navigatePage();
          }
        });
      } else {
        this.navigatePage();
      }
    } else {
      this.notificationService.warning('שים לב', 'עליך להוריד/לשלוח הנחיות');
    }
  }

  navigatePage(): void {
    const filesList = this.rows.checkedItems.map(item => item['file_id']);
    this.processService.setRecords(this.processId, filesList, this.rows).then(response => {
      this.processDataService.activeProcess.rows = response['group_things_ids'];
      if (response['sent'] && this.processDataService.activeProcess.rows.length === 0) {
        this.notificationService.warning('שים לב', 'אין אפשרות לעבור למסך הבא בחר רשומות שלא שודרו');
      } else {
        if (response['sent']) {
          this.notificationService.warning('שים לב', ' בחרת רשומות ששודר אם לא יעברו למסך הבא');
        }
        this.processDataService.activeProcess.is_references = false;
        this.processDataService.activeProcess.rows_status = false;
        this.processDataService.setProcess(this.processDataService.activeProcess);
        this.processLoading.setPage(3, true);
        this.selectUnit.setProcessData(this.processDataService);
      }
    });

  }

  setApprovalFile(): void {
    this.processService.setApprovalFile(this.processId).then(response => {
      if (response) {
        this.notificationService.success('', 'קובץ אושר בהצלחה');
      } else {
        this.notificationService.error('', 'קובץ לא אושר');

      }
    });
  }
}
