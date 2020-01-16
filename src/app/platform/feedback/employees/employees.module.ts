import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule, Routes } from '@angular/router';
import {
  MatAutocompleteModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
} from '@angular/material';

import { FileDropModule } from 'ngx-file-drop';
import { EmployeesComponent } from './employees.component';
import { PipesModule } from 'app/shared/_pipes/pipes.module';
import { BdSelectModule } from 'assets/js/bd-select/bd-select.module';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';
import { SendApplicationComponent } from './send-application/send-application.component';
import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';
import { SendFeedbackComponent } from './send-feedback/send-feedback.component';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { DocumentService } from 'app/shared/_services/http/document.service';

const routes: Routes = [{
  path: '', component: EmployeesComponent
}];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    FileDropModule,
    MatInputModule,
    MatAutocompleteModule,
    DatePickerModule,
    BdSelectModule,
    PipesModule,
    DataTableModule
  ],
  declarations: [
    EmployeesComponent,
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
    MonthlyTransferBlockService,
    DocumentService
  ],
  entryComponents: [
    SendApplicationComponent,
    SendFeedbackComponent
  ]
})
export class EmployeesModule { }
