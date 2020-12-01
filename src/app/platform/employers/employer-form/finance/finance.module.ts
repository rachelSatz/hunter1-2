import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceComponent } from './finance.component';
import { BdSelectModule } from '../../../../../assets/js/bd-select/bd-select.module';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule, MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule
} from '@angular/material';
import { DatePickerModule } from '../../../../shared/app-date-picker/app-date-picker.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: FinanceComponent }
];

@NgModule({

  declarations: [FinanceComponent],
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
    RouterModule.forChild(routes),]
})
export class FinanceModule { }
