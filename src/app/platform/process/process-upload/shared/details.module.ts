import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { DetailsComponent } from './details.component';
import { RouterModule, Routes} from '@angular/router';
import {
  MatAutocompleteModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatMenuModule, MatProgressBarModule,
  MatSelectModule, MatTooltipModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';

import { PipesModule } from 'app/shared/_pipes/pipes.module';
import { BdSelectModule } from 'assets/js/bd-select/bd-select.module';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { CommentsComponent } from './detailed-files/comments/comments.component';
import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';
import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';
import { GroupTransferComponent } from './detailed-records/group-transfer/group-transfer.component';
import { AttachReferenceComponent } from './detailed-files/attach-reference/attach-reference.component';
import { UpdatePaymentTypeComponent } from './detailed-files/update-payment-type/update-payment-type.component';
import { UpdatePaymentDateComponent } from './detailed-files/update-payment-date/update-payment-date.component';
import { UpdateAccountNumberComponent } from './detailed-files/update-account-number/update-account-number.component';


const routes: Routes = [
  { path: '', component: DetailsComponent, children: [
    // { path: '' , redirectTo: 'detailed-files', pathMatch: 'full'},
    { path: 'files', loadChildren: './detailed-files/detailed-files.module#DetailedFilesModule' },
    { path: 'records' , loadChildren:  './detailed-records/detailed-records.module#DetailedRecordsModule'},
    { path: 'records/:id' , loadChildren:  './detailed-records/detailed-records.module#DetailedRecordsModule'}
    ]}
  ];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatDialogModule,
    MatCheckboxModule, MatSelectModule, MatChipsModule,
    MatIconModule, MatAutocompleteModule, MatProgressBarModule, MatMenuModule,
    FormsModule, MatTooltipModule,
    PipesModule,
    BdSelectModule,
    DatePickerModule,
    DataTableModule
  ],
  providers: [MonthlyTransferBlockService],
  declarations: [ DetailsComponent,
    CommentsComponent, UpdatePaymentTypeComponent, AttachReferenceComponent, GroupTransferComponent,
    UpdateAccountNumberComponent, UpdatePaymentDateComponent],
  entryComponents: [ CommentsComponent, UpdatePaymentTypeComponent, AttachReferenceComponent,
    UpdateAccountNumberComponent, UpdatePaymentDateComponent, GroupTransferComponent]

})
export class DetailsModule { }
