import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';

import { PlatformComponent } from './platform.component';
import { InquiryFormComponent } from './feedback/shared/inquiry-form/inquiry-form.component';
import { CommentsFormComponent } from './feedback/shared/comments-form/comments-form.component';

import { OrganizationService } from 'app/shared/_services/http/organization.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';

import { IsAuthenticatedGuard } from 'app/shared/_guards/is-authenticated.guard';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';

const routes: Routes = [
  {
    path: '', component: PlatformComponent, canActivate: [IsAuthenticatedGuard], children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: 'app/platform/dashboard/dashboard.module#DashboardModule' },
      { path: 'employers', loadChildren: 'app/platform/operator/employers/employers.module#EmployersModule' },
      { path: 'contacts', loadChildren: 'app/platform/operator/employers/employer-form/contacts/contacts.module#ContactsModule' },
      { path: 'finance/invoices', loadChildren: 'app/platform/finance/invoices/invoices.module#InvoicesModule' },
      { path: 'compensations/process', loadChildren: 'app/platform/compensation/process/process.module#ProcessModule' },
      { path: 'compensations/deposits-report', loadChildren:
          'app/platform/compensation/deposits-report/deposits-report.module#DepositsReportModule' },
      { path: 'settings/users', loadChildren: 'app/platform/settings/users/users.module#UsersModule' },
      { path: 'settings/organizations', loadChildren: 'app/platform/settings/organizations/organizations.module#OrganizationsModule' },
      { path: 'process/table', loadChildren: 'app/platform/process/process-table/process-table.module#ProcessTableModule' },
      { path: 'compensations/dashboard', loadChildren: 'app/platform/compensation/dashboard/dashboard.module#DashboardModule' },
      { path: 'process/new/:status', loadChildren: 'app/platform/process/process-upload/process-upload.module#ProcessUploadModule' },
      { path: 'process/table', loadChildren: 'app/platform/process/process-table/process-table.module#ProcessTableModule' },
      { path: 'feedback/employees', loadChildren: 'app/platform/feedback/employees/employees.module#EmployeesModule' },
      { path: 'feedback/files', loadChildren: 'app/platform/feedback/files/files.module#FilesModule' },
      { path: 'operator/organizations', loadChildren: 'app/platform/settings/organizations/organizations.module#OrganizationsModule' },
      { path: 'operator/users', loadChildren: 'app/platform/settings/users/users.module#UsersModule' },
      { path: 'operator/employers', loadChildren: 'app/platform/operator/employers/employers.module#EmployersModule' },
      { path: 'operator/work-queue', loadChildren: 'app/platform/operator/work-queue/work-queue.module#WorkQueueModule'},
      { path: 'operator/contacts', loadChildren: 'app/platform/operator/employers/employer-form/contacts/contacts.module#ContactsModule' },
      { path: 'operator/tasks', loadChildren: 'app/platform/operator/employers/employer-form/tasks/tasks.module#TasksModule'}
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BdSelectModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatMenuModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [PlatformComponent, InquiryFormComponent, CommentsFormComponent],
  entryComponents: [InquiryFormComponent, CommentsFormComponent],
  providers: [IsAuthenticatedGuard, OrganizationService, EmployerService, ProcessDataService, DatePipe]
})
export class PlatformModule {}
