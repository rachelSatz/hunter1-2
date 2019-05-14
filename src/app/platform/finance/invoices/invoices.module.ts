import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesComponent } from './invoices.component';
import { RouterModule, Routes } from '@angular/router';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatDialogModule, MatCheckboxModule,
  MatSelectModule, MatIconModule, MatAutocompleteModule } from '@angular/material';

import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';
import { PipesModule } from 'app/shared/_pipes/pipes.module';
import { InvoiceService } from 'app/shared/_services/http/invoice.service';
import { ProactiveInvoiceFormComponent } from './proactive-invoice-form/proactive-invoice-form.component';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { RemarksFormComponent } from './remarks-form/remarks-form.component';
import { EmployersFinanceExcelComponent } from './employers-finance-excel/employers-finance-excel.component';
import { FilterItemsPipe } from 'app/shared/_pipes/filter-items.pipe';
import { NotificationService } from '../../../shared/_services/notification.service';
import { ManualInvoiceFormComponent } from './manual-invoice-form/manual-invoice-form.component';

const routes: Routes = [
  { path: '', component: InvoicesComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatDialogModule, MatCheckboxModule, MatSelectModule, MatIconModule,
    MatAutocompleteModule,
    DatePickerModule,
    DataTableModule,
    BdSelectModule,
    PipesModule
  ],
  declarations: [
    InvoicesComponent,
    ProactiveInvoiceFormComponent,
    RemarksFormComponent,
    EmployersFinanceExcelComponent,
    ManualInvoiceFormComponent
  ],
  providers: [InvoiceService, EmployerService, FilterItemsPipe, NotificationService],
  entryComponents: [ProactiveInvoiceFormComponent, RemarksFormComponent, EmployersFinanceExcelComponent, ManualInvoiceFormComponent]
})
export class InvoicesModule { }
