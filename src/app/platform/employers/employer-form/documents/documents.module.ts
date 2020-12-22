import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from './documents.component';
import { BdSelectModule } from '../../../../../assets/js/bd-select/bd-select.module';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule, MatDialogModule, MatDividerModule,
  MatFormFieldModule,
  MatInputModule, MatRadioModule,
  MatRippleModule
} from '@angular/material';
import { DatePickerModule } from '../../../../shared/app-date-picker/app-date-picker.module';
import { DataTableModule } from '../../../../shared/data-table/data-table.module';
import { InvoiceDetailsFormComponent } from './invoice-details-form/invoice-details-form.component';
import { DataTableComponent } from '../../../../shared/data-table/data-table.component';
import { RemarksFormComponent } from './remarks-form/remarks-form.component';



const routes: Routes = [
  { path: '', component: DocumentsComponent }
];

@NgModule({
  declarations: [
    DocumentsComponent,
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
      RemarksFormComponent],
    providers: [DataTableComponent]
})
export class DocumentsModule { }
