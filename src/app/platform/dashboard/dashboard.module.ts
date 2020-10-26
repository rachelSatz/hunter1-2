import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { BdSelectModule } from '../../../assets/js/bd-select/bd-select.module';
import { GeneralService } from '../../shared/_services/http/general.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {DatePickerModule} from '../../shared/app-date-picker/app-date-picker.module';
import {PipesModule} from '../../shared/_pipes/pipes.module';
import { EstPaymentFormComponent } from './est-payment-form/est-payment-form.component';
import {DataTableModule} from '../../shared/data-table/data-table.module';
import { NewEmployersFormComponent } from './new-employers-form/new-employers-form.component';
import { OtherPayerPopupComponent } from './other-payer-popup/other-payer-popup.component';
import { ChargedEmployersFormComponent } from './charged-employers-form/charged-employers-form.component';
import { ManuallyChargedEmployersComponent } from './manually-charged-employers/manually-charged-employers.component';
import { EmployersWithNoPaymentComponent } from './employers-with-no-payment/employers-with-no-payment.component';
import { EmployersPaymentZeroComponent } from './employers-payment-zero/employers-payment-zero.component';

const routes: Routes = [
  { path: '', component: DashboardComponent }
  ];

@NgModule({
  declarations: [DashboardComponent, EstPaymentFormComponent, NewEmployersFormComponent, OtherPayerPopupComponent, ChargedEmployersFormComponent, ManuallyChargedEmployersComponent, EmployersWithNoPaymentComponent, EmployersPaymentZeroComponent],

  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BdSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    DatePickerModule,
    MatInputModule,
    PipesModule,
    ReactiveFormsModule,
    DataTableModule,
    MatDialogModule

  ],
  providers: [GeneralService],
  entryComponents: [EstPaymentFormComponent, NewEmployersFormComponent, OtherPayerPopupComponent, ChargedEmployersFormComponent, ManuallyChargedEmployersComponent, EmployersWithNoPaymentComponent, EmployersPaymentZeroComponent],
})
export class DashboardModule { }
