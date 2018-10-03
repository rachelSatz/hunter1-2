import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { Select2Module } from 'ng2-select2';

import { DataTableModule } from '../../../shared/data-table/data-table.module';
import { ProcessDetailsModule } from '../process-details/process-details.module';
import { CommatizeNumberModule } from '../../../shared/_pipes/commatize-number.module';

import { ProcessPaymentComponent } from './process-payment.component';
import { ProcessEmployeePaymentsComponent } from './process-employee-payments/process-employee-payments.component';
import { ProcessPaymentTableComponent } from './process-payment-table/process-payment-table.component';
import { ProcessProductPaymentsComponent } from "./process-product-payments/process-product-payments.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Select2Module,
    MatSelectModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule,
    DataTableModule,MatTooltipModule,
    ProcessDetailsModule,
    CommatizeNumberModule
  ],
  declarations: [
    ProcessPaymentComponent,
    ProcessEmployeePaymentsComponent,
    ProcessPaymentTableComponent,
    ProcessProductPaymentsComponent
  ]
})
export class ProcessPaymentModule {}
