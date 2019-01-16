import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FileDropModule } from 'ngx-file-drop';
import { MatAutocompleteModule, MatCheckboxModule, MatChipsModule, MatDialogModule, MatFormFieldModule, MatIconModule,
  MatInputModule, MatSelectModule, MatProgressBarModule, MatMenuModule} from '@angular/material';


import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';
import { PipesModule } from 'app/shared/_pipes/pipes.module';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { NotificationService } from 'app/shared/_services/notification.service';

import { EmailComponent } from './email/email.component';
import { SendFileEmailComponent } from './send-file-email/send-file-email.component';
import { UpdatePaymentTypeComponent } from '../shared/detailed-files/update-payment-type/update-payment-type.component';
import { AttachReferenceComponent } from '../shared/detailed-files/attach-reference/attach-reference.component';
import { UpdateAccountNumberComponent } from '../shared/detailed-files/update-account-number/update-account-number.component';
import { PaymentComponent } from './payment.component';
import { UpdatePaymentDateComponent } from '../shared/detailed-files/update-payment-date/update-payment-date.component';


const routes: Routes = [
  { path: '', component: PaymentComponent }

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    FileDropModule,
    MatFormFieldModule, MatInputModule, MatDialogModule, MatCheckboxModule, MatSelectModule,
    MatChipsModule, MatIconModule, MatAutocompleteModule, MatProgressBarModule, MatMenuModule,
    BdSelectModule,
    PipesModule,
    DatePickerModule
  ],
  providers: [DatePipe, ProcessService, NotificationService],
  declarations: [PaymentComponent, EmailComponent, SendFileEmailComponent,
    UpdatePaymentTypeComponent, AttachReferenceComponent,
    UpdateAccountNumberComponent, UpdatePaymentDateComponent
  ],
  entryComponents: [ EmailComponent, SendFileEmailComponent,
    UpdatePaymentTypeComponent, AttachReferenceComponent,
    UpdateAccountNumberComponent, UpdatePaymentDateComponent]
})
export class PaymentModule {

}

