import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
  MatMenuModule,
  MatAutocompleteModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatOptionModule,
  MatRadioModule
} from '@angular/material';

import { PlatformComponent } from './platform.component';
import { InquiryFormComponent } from '../shared/_dialogs/inquiry-form/inquiry-form.component';
import { CommentsFormComponent } from '../shared/_dialogs/comments-form/comments-form.component';
import { ErrorMessageComponent } from '../shared/_dialogs/error-message/error-message.component';

import { OrganizationService } from 'app/shared/_services/http/organization.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';

import { DetailsComponent } from 'app/shared/_dialogs/details/details.component';
import { InquiriesComponent } from '../shared/_dialogs/inquiries/inquiries.component';
import { IsAuthenticatedGuard } from 'app/shared/_guards/is-authenticated.guard';
import { OperatorTasksService } from '../shared/_services/http/operator-tasks';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { AppHttpService } from '../shared/_services/http/app-http.service';
import { ProductService } from '../shared/_services/http/product.service';
import { TimerService } from '../shared/_services/http/timer';
import { FileDropModule } from 'ngx-file-drop';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';
import { FileDepositionComponent } from 'app/shared/_dialogs/file-deposition/file-deposition.component';
import { ChangeStatusComponent } from '../shared/_dialogs/change-status/change-status.component';
import { GroupService } from '../shared/_services/http/group.service';
// import { GroupTransferComponent } from 'app/shared/shared/group-transfer/group-transfer.component';


const routes: Routes = [
  {
    path: '', component: PlatformComponent, canActivate: [IsAuthenticatedGuard], children: [
      { path: '', redirectTo: 'process/table', pathMatch: 'full' },
      { path: 'employers', loadChildren: 'app/platform/operator/employers/employers.module#EmployersModule' },
      { path: 'contacts', loadChildren: 'app/platform/operator/employers/employer-form/contacts/contacts.module#ContactsModule' },
      { path: 'operator/campaigns', loadChildren: 'app/platform/campaigns/campaigns.module#CampaignsModule'},
      { path: 'operator/campaigns/groups', loadChildren: 'app/platform/campaigns/groups/groups.module#GroupsModule'},
      { path: 'operator/campaigns/campaigns-form',
        loadChildren: 'app/platform/campaigns/campaigns-form/campaigns-form.module#CampaignsFormModule'},
      { path: 'finance/invoices', loadChildren: 'app/platform/finance/invoices/invoices.module#InvoicesModule' },
      { path: 'finance/dashboard', loadChildren: 'app/platform/finance/dashboard/dashboard.module#DashboardModule' },
      { path: 'compensation/process', loadChildren: 'app/platform/compensation/process/process.module#ProcessModule' },
      { path: 'compensation/process-level-hp', loadChildren: 'app/platform/compensation/process-level-hp/' +
          'process-level-hp.module#ProcessLevelHpModule' },
      { path: 'compensation/deposits-report', loadChildren:
          'app/platform/compensation/deposits-report/deposits-report.module#DepositsReportModule' },
      { path: 'settings/users', loadChildren: 'app/platform/settings/users/users.module#UsersModule' },
      { path: 'settings/organizations', loadChildren: 'app/platform/settings/organizations/organizations.module#OrganizationsModule' },
      { path: 'compensation/dashboard', loadChildren: 'app/platform/compensation/dashboard/dashboard.module#DashboardModule' },
      // { path: 'process/new/:status', loadChildren: 'app/platform/process/process-upload/process-upload.module#ProcessUploadModule' },
      { path: 'process/new/:status', loadChildren: 'app/platform/process/process-loading/process-loading.module#ProcessLoadingModule' },
      { path: 'process/table', loadChildren: 'app/platform/process/process-table/process-table.module#ProcessTableModule' },
      { path: 'process/edit-payments', loadChildren: 'app/platform/process/edit-payments/edit-payments.module#EditPaymentsModule' },
      { path: 'feedback/employees', loadChildren: 'app/platform/feedback/employees/employees.module#EmployeesModule' },
      { path: 'feedback/files', loadChildren: 'app/platform/feedback/files/files.module#FilesModule' },
      { path: 'operator/organizations', loadChildren: 'app/platform/settings/organizations/organizations.module#OrganizationsModule' },
      { path: 'operator/users', loadChildren: 'app/platform/settings/users/users.module#UsersModule' },
      { path: 'operator/employers', loadChildren: 'app/platform/operator/employers/employers.module#EmployersModule' },
      { path: 'operator/employer-employees', loadChildren:
          'app/platform/operator/employer-employees/employer-employees.module#EmployerEmployeesModule' },
      { path: 'operator/work-queue', loadChildren: 'app/platform/operator/work-queue/work-queue.module#WorkQueueModule'},
      { path: 'operator/contacts', loadChildren: 'app/platform/operator/employers/employer-form/contacts/contacts.module#ContactsModule' },
      { path: 'operator/tasks', loadChildren: 'app/platform/operator/employers/employer-form/tasks/tasks.module#TasksModule'},
      { path: 'operator/documents', loadChildren:
          'app/platform/operator/employers/employer-form/documents/documents.module#DocumentsModule'},
      { path: 'operator/products', loadChildren: 'app/platform/operator/products/products.module#ProductsModule' },
      { path: 'operator/plans', loadChildren: 'app/platform/operator/plans/plans.module#PlansModule' },
      { path: 'operator/reports', loadChildren: 'app/platform/operator/reports-manager/reports-manager.module#ReportsManagerModule' },
      { path: 'operator/table', loadChildren: 'app/platform/process/process-table/process-table.module#ProcessTableModule' }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
    MatIconModule,
    MatRadioModule,
    MatMenuModule,
    FileDropModule,
    MatAutocompleteModule,
    DatePickerModule,
    BdSelectModule,
    DataTableModule
  ],
  declarations: [
    PlatformComponent,
    InquiryFormComponent,
    CommentsFormComponent,
    InquiriesComponent ,
    DetailsComponent,
    ErrorMessageComponent,
    FileDepositionComponent,
    // GroupTransferComponent,
    ChangeStatusComponent],
  entryComponents: [
    InquiryFormComponent,
    CommentsFormComponent,
    InquiriesComponent,
    DetailsComponent,
    ErrorMessageComponent,
    FileDepositionComponent,
    // GroupTransferComponent,
    ChangeStatusComponent
  ],
  providers: [IsAuthenticatedGuard, OrganizationService, EmployerService, ProcessDataService, GroupService,
    DatePipe, TimerService, OperatorTasksService, ProductService, AppHttpService]
})
export class PlatformModule {}
