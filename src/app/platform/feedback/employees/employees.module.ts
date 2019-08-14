import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from './employees.component';
import { RouterModule, Routes } from '@angular/router';
import {
  MatAutocompleteModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
} from '@angular/material';

import { FormsModule} from '@angular/forms';
import { FileDropModule } from 'ngx-file-drop';

import { PipesModule } from 'app/shared/_pipes/pipes.module';
import { BdSelectModule } from 'assets/js/bd-select/bd-select.module';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';
import { SendApplicationComponent } from './send-application/send-application.component';
import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';
import {SendFeedbackComponent} from './send-feedback/send-feedback.component';
// import { SendFeedbackComponent } from 'app/shared/_dialogs/send-feedback/send-feedback.component';

const routes: Routes = [{
  path: '', component: EmployeesComponent
}];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    FileDropModule,
    MatAutocompleteModule,
    DatePickerModule,
    BdSelectModule,
    DataTableModule,
    PipesModule
  ],
  declarations: [
    EmployeesComponent,
    SendApplicationComponent,
    SendFeedbackComponent
  ],
  entryComponents: [
    SendApplicationComponent,
    SendFeedbackComponent
  ],
  providers: [
    NotificationService,
    FeedbackService,
    ContactService,
    HelpersService,
    GeneralHttpService,
    ProcessService,
    MonthlyTransferBlockService
  ],
})
export class EmployeesModule { }
