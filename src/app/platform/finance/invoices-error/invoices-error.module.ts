import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesErrorComponent } from './invoices-error.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatDialogModule, MatCheckboxModule,
  MatSelectModule, MatIconModule, MatAutocompleteModule } from '@angular/material';
import {DatePickerModule} from '../../../shared/app-date-picker/app-date-picker.module';
import {DataTableModule} from '../../../shared/data-table/data-table.module';
import {BdSelectModule} from '../../../../assets/js/bd-select/bd-select.module';
import {PipesModule} from '../../../shared/_pipes/pipes.module';

const routes: Routes = [
  { path: '', component: InvoicesErrorComponent }
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
  declarations: [InvoicesErrorComponent]
})
export class InvoicesErrorModule { }
