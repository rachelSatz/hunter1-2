import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackComponent } from './feedback.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: FeedbackComponent  , children: [
      { path: '', loadChildren: 'app/platform/feedback/files/files.module#FilesModule' },
      { path: 'files', loadChildren: 'app/platform/feedback/files/files.module#FilesModule' },
      { path: 'employees', loadChildren: 'app/platform/feedback/employees/employees.module#EmployeesModule' }]
  }];


@NgModule({
  declarations: [FeedbackComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

  ]
})
export class FeedbackModule { }
