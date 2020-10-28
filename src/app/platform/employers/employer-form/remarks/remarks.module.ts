import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BdSelectModule} from '../../../../../assets/js/bd-select/bd-select.module';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule, MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule
} from '@angular/material';
import {DatePickerModule} from '../../../../shared/app-date-picker/app-date-picker.module';
import {RouterModule, Routes} from '@angular/router';
import {FinanceComponent} from "../finance/finance.component";
import {RemarksComponent} from "./remarks.component";
// import {FinanceComponent} from './finance.component';
// import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: RemarksComponent }
];
@NgModule({

  declarations: [RemarksComponent],
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
export class RemarksModule { }
