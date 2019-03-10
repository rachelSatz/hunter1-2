import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployerFormComponent } from './employer-form.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployersResolve } from 'app/shared/_resolves/employers.resolve';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule,
         MatInputModule, MatRadioModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { NotificationService } from 'app/shared/_services/notification.service';

const routes: Routes = [
  { path: '', component: EmployerFormComponent},
  { path: ':id', component: EmployerFormComponent, resolve: { employer: EmployersResolve }, children: [
      { path: '' , redirectTo: 'comments', pathMatch: 'full'},
      { path: 'comments', loadChildren: './comments/comments.module#CommentsModule' },
      { path: 'documents', loadChildren: './documents/documents.module#DocumentsModule' },
      { path: 'contacts', loadChildren: './contacts/contacts.module#ContactsModule' },
      { path: 'departments', loadChildren: './departments/departments.module#DepartmentsModule'},
      { path: 'defrayal', loadChildren: './defrayal/defrayal.module#DefrayalModule' },
      { path: 'finance', loadChildren: './finance/finance.module#FinanceModule' },
      { path: 'tasks', loadChildren: './tasks/tasks.module#TasksModule' },
      { path: 'reports', loadChildren: './reports/reports.module#ReportsModule' }
    ] }
  ];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule,
    MatCheckboxModule, MatRadioModule, MatSelectModule, MatButtonModule, MatIconModule,
    BdSelectModule, MatOptionModule
  ],
  declarations: [EmployerFormComponent],
  providers: [EmployerService, EmployersResolve, GeneralHttpService, NotificationService],
})

export class EmployerFormModule { }
