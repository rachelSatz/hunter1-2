import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

import { EmailComponent } from '../email/email.component';

import { ProcessService } from 'app/shared/_services/http/process.service';

@Component({
  selector: 'app-information-message',
  templateUrl: './information-message.component.html' })
export class InformationMessageComponent implements OnInit {

  email: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: number,
              private router: Router,
              private dialogRef: MatDialogRef<InformationMessageComponent>,
              private processService: ProcessService,
              private dialog: MatDialog) { }

  ngOnInit() {
    setTimeout(() => {
      this.dialogRef.close(); }, 5000);
  }

  setHomePage(): void {
    this.dialogRef.close();
    this.router.navigate(['platform', 'dashboard']);
  }

  openDialog(): void {
    this.dialogRef.close();
    this.processService.getPaymentMailOnCompletion(this.data).then( response => {
      this.email = response['email_address'];
      this.dialog.open(EmailComponent, {
        data: this.email,
        width: '550px',
        panelClass: 'email-dialog'
      });
    });
  }
}
