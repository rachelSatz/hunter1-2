import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from '../payment/payment.component';
import { FormsModule } from '@angular/forms';
import { FileDropModule } from 'ngx-file-drop';
import { EmailComponent } from './email/email.component';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { SendFileEmailComponent } from './send-file-email/send-file-email.component';
import { ProcessService } from 'app/shared/_services/http/process.service';
import {
  MatAutocompleteModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatProgressBarModule,
  MatMenuModule
} from '@angular/material';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { DetailedFilesComponent } from '../shared/detailed-files/detailed-files.component';
import { UpdatePaymentTypeComponent } from '../shared/detailed-files/update-payment-type/update-payment-type.component';
import { AttachReferenceComponent } from '../shared/detailed-files/attach-reference/attach-reference.component';
import { PipesModule } from 'app/shared/_pipes/pipes.module';
import { UpdateAccountNumberComponent } from '../shared/detailed-files/update-account-number/update-account-number.component';
import { UpdatePaymentDateComponent } from '../shared/detailed-files/update-payment-date/update-payment-date.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';
import { DetailedRecordsComponent } from '../shared/detailed-records/detailed-records.component';
import { CommentsComponent } from '../../../compensation/process/comments/comments.component';

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
    MatAutocompleteModule, MatProgressBarModule, MatMenuModule,
    BdSelectModule,
    PipesModule,
    DatePickerModule
  ],
  providers: [DatePipe, ProcessService, NotificationService],
  declarations: [PaymentComponent, EmailComponent, SendFileEmailComponent, DetailedFilesComponent, DetailedRecordsComponent,
    UpdatePaymentTypeComponent, AttachReferenceComponent, UpdateAccountNumberComponent, UpdatePaymentDateComponent,
    CommentsComponent
  ],
  entryComponents: [ EmailComponent, SendFileEmailComponent, ErrorMessageComponent, UpdatePaymentTypeComponent, AttachReferenceComponent,
    UpdateAccountNumberComponent, UpdatePaymentDateComponent, CommentsComponent]
})
export class PaymentModule { }

