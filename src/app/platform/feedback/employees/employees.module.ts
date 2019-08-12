import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from './employees.component';
import { RouterModule, Routes } from '@angular/router';
import {
  MatAutocompleteModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatNativeDateModule,
  MatOptionModule, MatSelectModule, MatTooltipModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { SendApplicationComponent } from './send-application/send-application.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { BdSelectModule } from 'assets/js/bd-select/bd-select.module';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { PipesModule } from 'app/shared/_pipes/pipes.module';
import { ProcessService } from 'app/shared/_services/http/process.service';
import {MonthlyTransferBlockService} from '../../../shared/_services/http/monthly-transfer-block';

const routes: Routes = [{
  path: '', component: EmployeesComponent
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BdSelectModule,
    FormsModule,
    DataTableModule,
    MatTooltipModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatChipsModule, MatOptionModule, MatDatepickerModule,
    MatNativeDateModule, MatMenuModule,
    MatIconModule, PipesModule, MatCheckboxModule, MatAutocompleteModule,
  ],
  exports: [],
  declarations: [EmployeesComponent, SendApplicationComponent],
  entryComponents: [SendApplicationComponent],
  providers: [
    NotificationService, FeedbackService,
    ContactService, HelpersService,
    GeneralHttpService, ProcessService,
    MonthlyTransferBlockService
  ],
})
export class EmployeesModule { }
