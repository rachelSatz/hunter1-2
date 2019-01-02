import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from '../payment/payment.component';
import { FormsModule } from '@angular/forms';
// import {
//   MatDialogModule,
//   MatFormFieldModule,
//   MatInputModule,
//   MatProgressBarModule, MatProgressSpinnerModule,
//   MatSelectModule,
//   MatTooltipModule
// } from '@angular/material';
import { FileDropModule } from 'ngx-file-drop';
import { EmailComponent } from './email/email.component';
import { SendFileEmailComponent } from './send-file-email/send-file-email.component';

const routes: Routes = [
  { path: '', component: PaymentComponent }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    FileDropModule
  ],
  declarations: [PaymentComponent, EmailComponent, SendFileEmailComponent],
  entryComponents: [
    EmailComponent, SendFileEmailComponent
  ]
})
export class PaymentModule { }

