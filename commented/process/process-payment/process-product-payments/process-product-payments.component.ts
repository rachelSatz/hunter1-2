import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material';

import { DataTableComponent } from '../../../../shared/data-table/data-table.component';

import { ProcessService } from '../../../../shared/_services/http/process.service';
import { ProcessFileService } from '../../../../shared/_services/http/process-file.service';

import { Process } from '../../../../shared/_models/process.model';

import * as FileSaver from 'file-saver';
import {NotificationService, NotificationType} from '../../../../shared/_services/notification.service';

@Component({
  selector: 'app-process-product-payments',
  templateUrl: './process-product-payments.component.html',
  styleUrls: ['../../../../shared/data-table/data-table.component.css']
})
export class ProcessProductPaymentsComponent extends DataTableComponent {

  public isLoading = false;

  constructor(@Inject(MAT_DIALOG_DATA) public process: Process, protected route: ActivatedRoute,
              private processService: ProcessService,
              private processFileService: ProcessFileService,
              private notificationService: NotificationService) {
    super(route);
  }

  fetchItems(): void {
    this.isLoading = true;
    this.processService.getProductPayments(this.process.id).then(response => {
      this.setItems(response);
      this.isLoading = false;
    });
  }

  downloadFile(paymentID: number): void {
    this.processFileService.downloadProductPaymentFile(paymentID)
    .then(response => {
       FileSaver.save(response, 'export.csv');
      })
    .catch(response => {
       this.notificationService.showResult('הקובץ אינו קיים במערכת', NotificationType.error);
    });
  }

  closeAll(): void {
    const paysIds: number[] = this.items.map(item => item.id);
    this.processService.closeAllProcess(this.process.id , paysIds , true).then(response => {
      this.notificationService.showResult(response.Message, NotificationType.success);
    });
  }

}
