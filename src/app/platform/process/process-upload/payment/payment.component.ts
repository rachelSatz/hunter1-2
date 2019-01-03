import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EmailComponent } from './email/email.component';
import { SendFileEmailComponent } from './send-file-email/send-file-email.component';
import { ProcessService } from 'app/shared/_services/http/process.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styles: ['.thborder { border-bottom: 2px solid #dee2e6 }' ]
})
export class PaymentComponent implements OnInit {

  constructor( private dialog: MatDialog, private  processService: ProcessService) {}

  fileId = 1;

  email: string;
  ngOnInit() {
    this.processService.getUploadFile(this.fileId)
      .then(() => {
      });
  }

  openDialogSendFileEmail(): void {
    this.dialog.open(SendFileEmailComponent, {
      width: '550px',
      panelClass: 'send-email-dialog'
    });
  }
}
