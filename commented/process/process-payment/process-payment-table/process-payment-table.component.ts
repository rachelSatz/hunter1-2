import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataTableComponent } from '../../../../shared/data-table/data-table.component';

import { ProcessService } from '../../../../shared/_services/http/process.service';

import { payTypeLabel, productTypeLabel, SentToSafeBoxes } from '../../../../shared/_const/EnumLabels';
import { Process } from '../../../../shared/_models/process.model';
import { SendFile } from "../../../../shared/_models/send-file.model";
import { TransmissionCommentComponent } from "../transmission-comment/transmission-comment.component";
import { MatDialog } from "@angular/material/dialog";
import { TransmissionProductDetailsComponent } from "../../process-transmission/transmission-product-details/transmission-product-details.component";
import { TransmissionBankDetailsComponent } from "../../process-transmission/transmission-bank-details/transmission-bank-details.component";
import { NotificationService } from "../../../../shared/_services/notification.service";
import { TransmissionDateComponent } from "../../process-transmission/transmission-date/transmission-date.component";

@Component({
  selector: 'app-process-payment-table',
  templateUrl: './process-payment-table.component.html',
  styleUrls: ['../../../../shared/data-table/data-table.component.css', './process-payment-table.component.css']
})
export class ProcessPaymentTableComponent extends DataTableComponent {

  public isLoading = false;
  process: Process;

  constructor(protected route: ActivatedRoute, private dialog: MatDialog, private processService:
     ProcessService, private routerLink: Router,
  private notificationService:NotificationService ) {
    super(route);
  }
  GetrouterLink() {
       let getSend = sessionStorage.getItem('Send'+this.process.id);
    const url = (this.process.pay || this.process.HaveDatevalue||getSend=='true'||this.process.NegativeProcess) ? "transmission" : "payment";
    return this.routerLink.navigate(['..', url], { relativeTo: this.route });

  }
  fetchItems(): void {
    this.isLoading = true;

    this.process = this.route.parent.snapshot.data['process'].data.process;

    this.processService.loadTransmissionTableData(this.process.id).then(response => {
      this.setItems(response['data']);
      this.isLoading = false;
    });
  }

  getproductTypeLabel(key: number): string {
    return productTypeLabel.get(key);
  }

  getPayTypeLabel(key: number): string {
    return payTypeLabel.get(key);
  }

  getSentToSafeBoxesLabel(key: number): string {
    return SentToSafeBoxes.get(key);
  }
  /*
private LoadData(): void {
     this.isLoading = true;
    this.processService.loadTransmissionTableData(this.process.id).then(response => {
      this.process = response['data'];
    this.isLoading = false;
     
    });
  }*/

  openProductDetailsDialog(paymentID: number): void {
    this.dialog.open(TransmissionProductDetailsComponent, {
      data: paymentID
    });
  }
  Gettitle(sendFile: SendFile) {
    if (sendFile.kindPay == 1) {
      return +"  " + sendFile.bankBranch.bank.text + "  " + sendFile.bankBranch.text + "  " + sendFile.accountNumber;
    }
    return '';

  }
  openBankDetailsDialog(sendFile: SendFile): void {
    let payDetails: { file: SendFile, process: Process } = { file: sendFile, process: this.process };
    const dialog = this.dialog.open(TransmissionBankDetailsComponent, {
      data: payDetails,
      width: '94%'
    });
    dialog.afterClosed().subscribe(response => {

      this.fetchItems();

    });
  }
 openDateDialog(sendFile: SendFile): void {
    let payDetails: { file: SendFile, process: Process } = { file: sendFile, process: this.process };
    const dialog = this.dialog.open(TransmissionDateComponent, {
      data: payDetails,
    });
     dialog.afterClosed().subscribe(response => {
     this.fetchItems();

    });
  }
  openCommentDialog(sendFile: SendFile): void {
    let payDetails: { file: SendFile, process: Process } = { file: sendFile, process: this.process };
    const dialog = this.dialog.open(TransmissionCommentComponent, {
      data: payDetails
    });
    dialog.afterClosed().subscribe(response => {
      this.fetchItems();
    });
  }
}
