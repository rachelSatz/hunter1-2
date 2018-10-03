import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Select2Module } from 'ng2-select2';
import { MatDatepickerModule, MatFormFieldModule, MatSelectModule } from '@angular/material';

import { DataTableModule } from '../../shared/data-table/data-table.module';
import { ProcessUploadModule } from './process-upload/process-upload.module';
import { ProcessPaymentModule } from './process-payment/process-payment.module';
import { ProcessTransmissionModule } from './process-transmission/process-transmission.module';
import { ProcessComponent } from './process.component';
import { EmployeePaymentsTableComponent } from './employee-payments-table/employee-payments-table.component';
import { EmployeePaymentFormComponent } from './employee-payment-form/employee-payment-form.component';
import { ProcessResolve } from '../../shared/_resolves/process.resolve';
import { BankAccountEmployerComponent } from "./bank-account-employer/bank-account-employer.component";


@NgModule({
  imports: [

    CommonModule,
    FormsModule,
    RouterModule,
    Select2Module,
    MatFormFieldModule, MatSelectModule, MatDatepickerModule,
    DataTableModule,
    ProcessUploadModule,
    ProcessPaymentModule,
    ProcessTransmissionModule,
  ],
  declarations: [
    ProcessComponent,
    EmployeePaymentsTableComponent,
    EmployeePaymentFormComponent,
    BankAccountEmployerComponent
  ],
  entryComponents: [EmployeePaymentFormComponent,BankAccountEmployerComponent],
  providers: [ProcessResolve]
})
export class ProcessModule {}
