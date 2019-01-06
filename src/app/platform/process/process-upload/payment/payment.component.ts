import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EmailComponent } from './email/email.component';
import { SendFileEmailComponent } from './send-file-email/send-file-email.component';
<<<<<<< HEAD
import { ProcessService } from '../../../../shared/_services/http/process.service';
import {Router} from '@angular/router';

=======
import { ProcessService } from 'app/shared/_services/http/process.service';
>>>>>>> 58d272f074bcd2340005032d4f032a027e886e78

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styles: ['.thborder { border-bottom: 2px solid #dee2e6 }' ]
})
export class PaymentComponent implements OnInit {
<<<<<<< HEAD
  constructor( private dialog: MatDialog, private  processService: ProcessService,  private router: Router) { }
=======

  constructor( private dialog: MatDialog, private  processService: ProcessService) {}

>>>>>>> 58d272f074bcd2340005032d4f032a027e886e78
  fileId = 1;

  email: string;
  ngOnInit() {
    this.processService.getUploadFile(this.fileId)
<<<<<<< HEAD
      .then( () => { });

  }

  openDialog(): void {
    this.getEmailUser();
     this.dialog.open(EmailComponent, {
       // data: this.email,
       width: '550px',
       panelClass: 'email-dialog'
     });
=======
      .then(() => {
      });
>>>>>>> 58d272f074bcd2340005032d4f032a027e886e78
  }

  openDialogSendFileEmail(): void {
    this.dialog.open(SendFileEmailComponent, {
      width: '550px',
      panelClass: 'send-email-dialog'
    });
  }
<<<<<<< HEAD

  getEmailUser() {
    this.processService.getEmailUser().then( response => this.email = response['email']);
  }

  goToHomePage() {
    this.router.navigate(['platform', 'dashboard']);
  }
=======
>>>>>>> 58d272f074bcd2340005032d4f032a027e886e78
}
