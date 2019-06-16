import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';

import { EditPaymentResolve } from 'app/shared/_resolves/edit-payment.resolve';

import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';
import { NotificationService } from 'app/shared/_services/notification.service';
import { EditPaymentsComponent } from './edit-payments.component';
import {MonthlyTransferBlockService} from '../../../shared/_services/http/monthly-transfer-block';


const routes: Routes = [
  // { path: '', component: EditPaymentsComponent },
  { path: ':id', component: EditPaymentsComponent, resolve: { mtb: EditPaymentResolve } }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    DatePickerModule,
    BdSelectModule,
  ],
  declarations: [EditPaymentsComponent],
  providers: [EditPaymentResolve, MonthlyTransferBlockService, NotificationService]
})

export class EditPaymentsModule {


}
