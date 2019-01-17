import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { DetailsComponent } from './details.component';
import { RouterModule, Routes} from '@angular/router';
import {
  MatAutocompleteModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatMenuModule, MatProgressBarModule,
  MatSelectModule, MatTooltipModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';

import { DetailedFilesComponent } from '../detailed-files/detailed-files.component';
import { DetailedRecordsComponent } from '../detailed-records/detailed-records.component';
import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';
import { CommentsComponent } from '../detailed-files/comments/comments.component';
import { UpdatePaymentTypeComponent } from '../detailed-files/update-payment-type/update-payment-type.component';
import { AttachReferenceComponent } from '../detailed-files/attach-reference/attach-reference.component';
import { UpdateAccountNumberComponent } from '../detailed-files/update-account-number/update-account-number.component';
import { UpdatePaymentDateComponent } from '../detailed-files/update-payment-date/update-payment-date.component';
import { PipesModule } from 'app/shared/_pipes/pipes.module';
import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';
import { GroupTransferComponent } from '../detailed-records/group-transfer/group-transfer.component';
import { GroupBankAccountComponent } from '../detailed-records/group-bank-account/group-bank-account.component';


const routes: Routes = [
  { path: '', component: DetailsComponent}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatDialogModule,
    MatCheckboxModule, MatSelectModule, MatChipsModule,
    MatIconModule, MatAutocompleteModule, MatProgressBarModule, MatMenuModule,
    FormsModule, MatTooltipModule,
    PipesModule,
    BdSelectModule,
    DatePickerModule
  ],
  // exports: [DatePipe],
  providers: [MonthlyTransferBlockService],
  declarations: [ DetailsComponent, DetailedRecordsComponent, DetailedFilesComponent,
    CommentsComponent, UpdatePaymentTypeComponent, AttachReferenceComponent, GroupTransferComponent,
    UpdateAccountNumberComponent, UpdatePaymentDateComponent, GroupBankAccountComponent],
  entryComponents: [CommentsComponent, UpdatePaymentTypeComponent, AttachReferenceComponent,
    UpdateAccountNumberComponent, UpdatePaymentDateComponent, GroupTransferComponent, GroupBankAccountComponent]

})
export class DetailsModule { }
