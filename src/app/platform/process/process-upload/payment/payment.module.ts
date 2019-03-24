import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FileDropModule } from 'ngx-file-drop';
import { MatAutocompleteModule, MatCheckboxModule, MatChipsModule,
         MatDialogModule, MatFormFieldModule, MatIconModule,
         MatInputModule, MatSelectModule, MatProgressBarModule, MatMenuModule } from '@angular/material';
import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';
import { PipesModule } from 'app/shared/_pipes/pipes.module';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { NotificationService } from 'app/shared/_services/notification.service';

import { EmailComponent } from './email/email.component';
import { SendFileEmailComponent } from './send-file-email/send-file-email.component';
import { PaymentComponent } from './payment.component';
import {InformationMessageComponent} from './information-message/information-message.component';


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
  providers: [ProcessService, NotificationService],
  declarations: [PaymentComponent, EmailComponent, SendFileEmailComponent, InformationMessageComponent],
  entryComponents: [ EmailComponent, SendFileEmailComponent, InformationMessageComponent]

})
export class PaymentModule {

}

