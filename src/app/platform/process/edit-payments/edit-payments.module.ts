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
  MatSelectModule,
  MatDatepickerModule
} from '@angular/material';

import { EditPaymentsComponent } from './edit-payments.component';
import { BdSelectModule } from 'assets/js/bd-select/bd-select.module';
import { EditPaymentResolve } from 'app/shared/_resolves/edit-payment.resolve';
import { NotificationService } from 'app/shared/_services/notification.service';
import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';
import { ProcessService } from 'app/shared/_services/http/process.service';


const routes: Routes = [
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
    MatDatepickerModule,
    BdSelectModule,
  ],
  declarations: [ EditPaymentsComponent ],
  providers: [ EditPaymentResolve, MonthlyTransferBlockService,
    NotificationService, ProcessService]
})

export class EditPaymentsModule {


}
