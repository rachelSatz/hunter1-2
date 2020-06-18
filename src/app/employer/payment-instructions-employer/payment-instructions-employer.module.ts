import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PaymentInstructionsEmployerComponent } from '../payment-instructions-employer/payment-instructions-employer.component';
import { FormsModule } from '@angular/forms';
import { BdSelectModule } from 'assets/js/bd-select/bd-select.module';
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';


const routes: Routes = [
  { path: '', component: PaymentInstructionsEmployerComponent , children: [
    { path: 'files', loadChildren: 'app/shared/shared/detailed-files/detailed-files.module#DetailedFilesModule' },
    { path: 'records', loadChildren: 'app/shared/shared/detailed-records/detailed-records.module#DetailedRecordsModule' },
    { path: 'records/:id' , loadChildren:  'app/shared/shared/detailed-records/detailed-records.module#DetailedRecordsModule'}
  ]
  }];


@NgModule({
  declarations: [PaymentInstructionsEmployerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    BdSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class PaymentInstructionsEmployerModule { }
