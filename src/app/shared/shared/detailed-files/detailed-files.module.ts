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
  MatDialogModule, MatProgressSpinnerModule, MatDatepickerModule
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
import { ProcessService } from 'app/shared/_services/http/process.service';
import { GroupTransferComponent } from 'app/shared/shared/detailed-files/group-transfer/group-transfer.component';
import { UpdatePaymentDateComponent } from 'app/shared/shared/detailed-files/update-payment-date/update-payment-date.component';


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
    DataTableModule,
    MatDatepickerModule
  ],
  providers: [ NotificationService,
    MonthlyTransferBlockService,
    PaymentInstructionsComponent,
    ReferenceComponent,
    ProcessService],
  declarations: [ DetailedFilesComponent,
    GroupTransferComponent,
    UpdateAccountNumberComponent,
    UpdatePaymentTypeComponent,
    UpdatePaymentDateComponent,
    OpenSentComponent ],
  entryComponents: [UpdateAccountNumberComponent,
    UpdatePaymentTypeComponent,
    UpdatePaymentDateComponent,
    OpenSentComponent, GroupTransferComponent],

})
export class DetailedFilesModule {
}
