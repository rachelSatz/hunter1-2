import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployerFormComponent } from './employer-form.component';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule } from '@angular/material';

const routes: Routes = [
  { path: '', component: EmployerFormComponent , children: [
      { path: 'comments', loadChildren: './comments/comments.module#CommentsModule' },
      { path: 'documents', loadChildren: './documents/documents.module#DocumentsModule' },
      { path: 'contacts', loadChildren: './contacts/contacts.module#ContactsModule' },
      { path: 'departments', loadChildren: './departments/departments.module#DepartmentsModule' },
      { path: 'defrayal', loadChildren: './defrayal/defrayal.module#DefrayalModule' },
      { path: 'finance', loadChildren: './finance/finance.module#FinanceModule' },
      { path: 'tasks', loadChildren: './tasks/tasks.module#TasksModule' },
      { path: 'reports', loadChildren: './reports/reports.module#ReportsModule' }
    ]}
  ];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule
  ],
  declarations: [EmployerFormComponent],
})

export class EmployerFormModule { }
