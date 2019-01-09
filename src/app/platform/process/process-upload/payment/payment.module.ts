import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from '../payment/payment.component';
import { FormsModule } from '@angular/forms';
import { FileDropModule } from 'ngx-file-drop';
import { EmailComponent } from './email/email.component';
import { SendFileEmailComponent } from './send-file-email/send-file-email.component';
import { ProcessService } from '../../../../shared/_services/http/process.service';
import {
  MatAutocompleteModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatProgressBarModule
} from '@angular/material';
import {ErrorMessageComponent} from './error-message/error-message.component';
import {NotificationService} from '../../../../shared/_services/notification.service';

const routes: Routes = [
  { path: '', component: PaymentComponent }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    FileDropModule,
    MatFormFieldModule, MatInputModule, MatDialogModule, MatCheckboxModule, MatSelectModule, MatChipsModule, MatIconModule,
    MatAutocompleteModule, MatProgressBarModule
  ],
  providers: [ProcessService, NotificationService],
  declarations: [PaymentComponent, EmailComponent, SendFileEmailComponent, ErrorMessageComponent],
  entryComponents: [ EmailComponent, SendFileEmailComponent, ErrorMessageComponent ]
})
export class PaymentModule { }

