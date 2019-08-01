import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { FileDropModule } from 'ngx-file-drop';
import { RouterModule, Routes } from '@angular/router';
import { MatAutocompleteModule, MatCheckboxModule, MatChipsModule,
         MatDialogModule, MatFormFieldModule, MatIconModule,
         MatInputModule, MatSelectModule, MatProgressBarModule, MatMenuModule } from '@angular/material';

import { PipesModule } from 'app/shared/_pipes/pipes.module';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { NotificationService } from 'app/shared/_services/notification.service';
import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';

import { PaymentComponent } from './payment.component';
import { EmailComponent } from './email/email.component';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { InformationMessageComponent } from './information-message/information-message.component';
import {SendFileEmailComponent} from './send-file-email/send-file-email.component';


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
  providers: [ProcessService, NotificationService, HelpersService, ContactService],
  declarations: [PaymentComponent, EmailComponent, InformationMessageComponent, SendFileEmailComponent],
  entryComponents: [ EmailComponent, InformationMessageComponent, SendFileEmailComponent]

})
export class PaymentModule {

}

