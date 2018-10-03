import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Select2Module } from 'ng2-select2';
import { MatProgressSpinnerModule, MatCheckboxModule, MatSelectModule, MatRadioModule,
  MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, MatTooltipModule
} from '@angular/material';

import { DataTableModule } from '../../../shared/data-table/data-table.module';
import { ProcessDetailsModule } from '../process-details/process-details.module';
import { SignaturePadModule } from 'angular2-signaturepad';
import { ProcessTransmissionComponent } from './process-transmission.component';
import { TransmissionProductDetailsComponent } from './transmission-product-details/transmission-product-details.component';
import { TransmissionBankDetailsComponent } from './transmission-bank-details/transmission-bank-details.component';
import { TransmissionDateComponent } from './transmission-date/transmission-date.component';
import { TransmissionCommentComponent } from '../process-payment/transmission-comment/transmission-comment.component';
import { TransmissionIntroFormComponent } from './transmission-intro-form/transmission-intro-form.component';
import { TransmissionProductDetailsFullComponent } from "./transmission-product-details-Full/transmission-product-details-full.component";
import { PopupRememberRefundComponent } from "./popupRememberRefund/popup-remember-refund.component";
import { ConfirmDisclaimerFileComponent } from "./confirm-disclaimer-file/confirm-disclaimer-file.component";


@NgModule({
  imports: [
    SignaturePadModule,
    CommonModule,
    FormsModule,
    RouterModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule, MatCheckboxModule, MatSelectModule, MatRadioModule, MatFormFieldModule,
    MatInputModule, MatDatepickerModule, MatSlideToggleModule,MatTooltipModule,
    ProcessDetailsModule,
    Select2Module,
    DataTableModule,
  ],
  declarations: [
    ProcessTransmissionComponent,
    TransmissionProductDetailsComponent,
    TransmissionBankDetailsComponent,
    TransmissionDateComponent,
    TransmissionCommentComponent,
    TransmissionIntroFormComponent,
    TransmissionProductDetailsFullComponent,
    PopupRememberRefundComponent,
    ConfirmDisclaimerFileComponent
  ],
  entryComponents: [
    TransmissionProductDetailsComponent,
    TransmissionProductDetailsFullComponent,
    TransmissionDateComponent,
    TransmissionBankDetailsComponent,
    TransmissionCommentComponent,
    TransmissionIntroFormComponent,PopupRememberRefundComponent,ConfirmDisclaimerFileComponent
  ],
})
export class ProcessTransmissionModule {}
