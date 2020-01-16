import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { FileDropModule } from 'ngx-file-drop';
import { RouterModule, Routes } from '@angular/router';
import {
  MatDatepickerModule,
  MatAutocompleteModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatProgressBarModule,
  MatMenuModule } from '@angular/material';

import { PipesModule } from 'app/shared/_pipes/pipes.module';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { NotificationService } from 'app/shared/_services/notification.service';

import { PaymentComponent } from './payment.component';
import { EmailComponent } from './email/email.component';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { InformationMessageComponent } from './information-message/information-message.component';
import { SendFileEmailComponent } from './send-file-email/send-file-email.component';
import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';
import { GroupHistoryComponent } from './group-history/group-history.component';
import { DataTableModule } from 'app/shared/data-table/data-table.module';


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
    MatDatepickerModule,
    BdSelectModule,
    PipesModule,
    DataTableModule
  ],
  providers: [
    ProcessService,
    NotificationService,
    HelpersService,
    ContactService,
    MonthlyTransferBlockService],
  declarations: [PaymentComponent,
    EmailComponent,
    InformationMessageComponent,
    SendFileEmailComponent,
    GroupHistoryComponent],
  entryComponents: [
    EmailComponent,
    InformationMessageComponent,
    SendFileEmailComponent,
    GroupHistoryComponent]

})
export class PaymentModule {

}

