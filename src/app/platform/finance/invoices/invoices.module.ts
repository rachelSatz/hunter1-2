import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesComponent } from './invoices.component';
import { RouterModule, Routes } from '@angular/router';
import { DataTableModule } from '../../../shared/data-table/data-table.module';
import { BdSelectModule } from '../../../../assets/js/bd-select/bd-select.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule, MatDialogModule, MatDividerModule,
  MatFormFieldModule,
  MatInputModule, MatRadioModule,
  MatRippleModule
} from '@angular/material';
import { DatePickerModule } from '../../../shared/app-date-picker/app-date-picker.module';
import { ManualInvoiceFormComponent } from './manual-invoice-form/manual-invoice-form.component';
import { TaxInvoiceFormComponent } from './tax-invoice-form/tax-invoice-form.component';
import { TransactionInvoiceFormComponent } from './transaction-invoice-form/transaction-invoice-form.component';
import { TaxOnlyInvoiceFormComponent } from './tax-only-invoice-form/tax-only-invoice-form.component';
import { ReportsFormComponent } from './reports-form/reports-form.component';
import { InvoiceService } from '../../../shared/_services/http/invoice.service';
import { InvoiceDetailsFormComponent } from './invoice-details-form/invoice-details-form.component';
import { RemarksFormComponent } from './remarks-form/remarks-form.component';
import { SideFiltersComponent } from '../../../shared/data-table/side-filters/side-filters.component';
import { PlatformComponent } from '../../platform.component';
import { ProactiveInvoiceFormComponent } from './proactive-invoice-form/proactive-invoice-form.component';
import { CreditCardExelComponent } from './credit-card-exel/credit-card-exel.component';


const routes: Routes = [
  { path: '', component: InvoicesComponent }
];


@NgModule({
  declarations: [
    InvoicesComponent,
    ManualInvoiceFormComponent,
    TaxInvoiceFormComponent,
    TransactionInvoiceFormComponent,
    TaxOnlyInvoiceFormComponent,
    ReportsFormComponent,
    InvoiceDetailsFormComponent,
    RemarksFormComponent,
    ProactiveInvoiceFormComponent,
    CreditCardExelComponent
  ],
  imports: [
    CommonModule,
    DataTableModule,
    BdSelectModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatDatepickerModule,
    DatePickerModule,
    MatCheckboxModule,
    MatDividerModule,
    RouterModule.forChild(routes),
    MatRadioModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  entryComponents: [
     ManualInvoiceFormComponent,
     TaxInvoiceFormComponent,
     TransactionInvoiceFormComponent,
     TaxOnlyInvoiceFormComponent,
     ReportsFormComponent,
     InvoiceDetailsFormComponent,
     RemarksFormComponent,
     ProactiveInvoiceFormComponent,
     CreditCardExelComponent
  ],
  providers: [
    InvoiceService, SideFiltersComponent, PlatformComponent
  ]
})
export class InvoicesModule { }
