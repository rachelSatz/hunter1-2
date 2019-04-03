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
import { DataTableModule } from 'app/shared/data-table-1/data-table.module';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { PipesModule } from 'app/shared/_pipes/pipes.module';

const routes: Routes = [{
  path: '', component: EmployeesComponent
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BdSelectModule,
    FormsModule,
    MatTooltipModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, DataTableModule, MatChipsModule,
    MatOptionModule, MatDatepickerModule,
    MatNativeDateModule, MatMenuModule,
    MatIconModule, PipesModule,
    MatCheckboxModule, MatAutocompleteModule,
  ],
  exports: [],
  declarations: [EmployeesComponent, SendApplicationComponent],
  entryComponents: [SendApplicationComponent],
  providers: [NotificationService, FeedbackService, ContactService, HelpersService, GeneralHttpService],
})
export class EmployeesModule { }
