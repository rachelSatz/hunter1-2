import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {DocumentsComponent} from './documents.component';
import {BdSelectModule} from '../../../../../assets/js/bd-select/bd-select.module';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule, MatDialogModule, MatDividerModule,
  MatFormFieldModule,
  MatInputModule, MatRadioModule,
  MatRippleModule
} from '@angular/material';
import {DatePickerModule} from '../../../../shared/app-date-picker/app-date-picker.module';
import {DataTableModule} from '../../../../shared/data-table/data-table.module';
import {InvoiceDetailsFormComponent} from './invoice-details-form/invoice-details-form.component';
import {EmployersFinanceExcelComponent} from './employers-finance-excel/employers-finance-excel.component';
import {ManualInvoiceFormComponent} from './manual-invoice-form/manual-invoice-form.component';
import {TaxInvoiceFormComponent} from './tax-invoice-form/tax-invoice-form.component';
import {TransactionInvoiceFormComponent} from './transaction-invoice-form/transaction-invoice-form.component';
import {TaxOnlyInvoiceFormComponent} from './tax-only-invoice-form/tax-only-invoice-form.component';
import {ReportsFormComponent} from './reports-form/reports-form.component';
import {DataTableComponent} from '../../../../shared/data-table/data-table.component';
import {RemarksFormComponent} from './remarks-form/remarks-form.component';



const routes: Routes = [
  { path: '', component: DocumentsComponent }
];

@NgModule({
  declarations: [DocumentsComponent,EmployersFinanceExcelComponent,
    ManualInvoiceFormComponent,
    TaxInvoiceFormComponent,
    TransactionInvoiceFormComponent,
    TaxOnlyInvoiceFormComponent,
    ReportsFormComponent,
    InvoiceDetailsFormComponent,
    RemarksFormComponent],
  imports: [
    CommonModule,
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
    DataTableModule,
    MatDialogModule,
    RouterModule.forChild(routes),
    MatRadioModule],

   entryComponents: [
     InvoiceDetailsFormComponent,
     EmployersFinanceExcelComponent,
     ManualInvoiceFormComponent,
     TaxInvoiceFormComponent,
     TransactionInvoiceFormComponent,
     TaxOnlyInvoiceFormComponent,
     ReportsFormComponent,
      RemarksFormComponent],
    providers: [DataTableComponent]
})
export class DocumentsModule { }
