import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EmailComponent } from './email/email.component';
import { SendFileEmailComponent } from './send-file-email/send-file-email.component';
import { ProcessService } from '../../../../shared/_services/http/process.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styles: ['.thborder { border-bottom: 2px solid #dee2e6 }' ]
})
export class PaymentComponent implements OnInit {
  constructor( private dialog: MatDialog, private  processService: ProcessService,  private router: Router) { }
  fileId = 1;
  divshow = 1;
  email: string;
  ngOnInit() {
    this.processService.getUploadFile(this.fileId)
      .then( () => { });

  }

  openDialog(): void {
    this.getEmailUser();
     this.dialog.open(EmailComponent, {
       // data: this.email,
       width: '550px',
       panelClass: 'email-dialog'
     });
  }

  openDialogSendFileEmail(): void {
    this.dialog.open(SendFileEmailComponent, {
      width: '550px',
      panelClass: 'send-email-dialog'
    });
  }

  getEmailUser() {
    this.processService.getEmailUser().then( response => this.email = response['email']);
  }

  goToHomePage() {
    this.router.navigate(['platform', 'dashboard']);
  }
}
