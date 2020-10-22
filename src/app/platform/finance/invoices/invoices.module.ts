import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesComponent } from './invoices.component';
import { RouterModule, Routes } from '@angular/router';
import { DataTableModule } from '../../../shared/data-table/data-table.module';
import { BdSelectModule } from '../../../../assets/js/bd-select/bd-select.module';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule, MatDialogModule, MatDividerModule,
  MatFormFieldModule,
  MatInputModule, MatRadioModule,
  MatRippleModule
} from '@angular/material';
import {DatePickerModule} from '../../../shared/app-date-picker/app-date-picker.module';
import { EmployersFinanceExcelComponent } from './employers-finance-excel/employers-finance-excel.component';
import { ManualInvoiceFormComponent } from './manual-invoice-form/manual-invoice-form.component';
import { TaxInvoiceFormComponent } from './tax-invoice-form/tax-invoice-form.component';
import { TransactionInvoiceFormComponent } from './transaction-invoice-form/transaction-invoice-form.component';
import { TaxOnlyInvoiceFormComponent } from './tax-only-invoice-form/tax-only-invoice-form.component';
import { ReportsFormComponent } from './reports-form/reports-form.component';
import { InvoiceService } from '../../../shared/_services/http/invoice.service';
import { InvoiceDetailsFormComponent } from './invoice-details-form/invoice-details-form.component';
import { RemarksFormComponent } from './remarks-form/remarks-form.component';
import {SideFiltersComponent} from '../../../shared/data-table/side-filters/side-filters.component';


const routes: Routes = [
  { path: '', component: InvoicesComponent }
  // { path: '', component: InvoicesComponent ,data:{some_data: 'sss'} }

];


@NgModule({
  declarations: [
    InvoicesComponent,
    EmployersFinanceExcelComponent,
    ManualInvoiceFormComponent,
    TaxInvoiceFormComponent,
    TransactionInvoiceFormComponent,
    TaxOnlyInvoiceFormComponent,
    ReportsFormComponent,
    InvoiceDetailsFormComponent,
    RemarksFormComponent
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
    MatDialogModule
  ],
  entryComponents: [
     EmployersFinanceExcelComponent,
     ManualInvoiceFormComponent,
     TaxInvoiceFormComponent,
     TransactionInvoiceFormComponent,
     TaxOnlyInvoiceFormComponent,
     ReportsFormComponent,
     InvoiceDetailsFormComponent,
      RemarksFormComponent
  ],
  providers: [
    InvoiceService, SideFiltersComponent
  ]
})
export class InvoicesModule { }
