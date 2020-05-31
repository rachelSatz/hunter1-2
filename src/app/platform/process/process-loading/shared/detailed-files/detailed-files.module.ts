import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatSnackBarModule,
  MatSidenavModule,
  MatListModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatMenuModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDialogModule, MatProgressSpinnerModule
} from '@angular/material';

import { NotificationService } from 'app/shared/_services/notification.service';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { DetailedFilesComponent } from './detailed-files.component';
import { UpdatePaymentTypeComponent } from './update-payment-type/update-payment-type.component';
import { UpdateAccountNumberComponent } from './update-account-number/update-account-number.component';
import { OpenSentComponent } from './open-sent/open-sent.component';
import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';
import { PaymentInstructionsComponent } from 'app/platform/process/process-loading/payment-instructions/payment-instructions.component';
import { ReferenceComponent } from 'app/platform/process/process-loading/reference/reference.component';


const route: Routes = [
  { path: '', component: DetailedFilesComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    MatSnackBarModule,
    MatSidenavModule,
    MatListModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatIconModule,
    DataTableModule
  ],
  providers: [ NotificationService,  MonthlyTransferBlockService, PaymentInstructionsComponent, ReferenceComponent ],
  declarations: [ DetailedFilesComponent,
    UpdateAccountNumberComponent,
    UpdatePaymentTypeComponent,
    OpenSentComponent ],
  entryComponents: [UpdateAccountNumberComponent, UpdatePaymentTypeComponent, OpenSentComponent],

})
export class DetailedFilesModule { }
