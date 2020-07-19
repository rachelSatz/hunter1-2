import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { FeedbackEmployerComponent } from 'app/employer/feedback-employer/feedback-employer.component';


const routes: Routes = [
  { path: '', component: FeedbackEmployerComponent , children: [
    // { path: '', loadChildren: 'app/feedback/files/files.module#FilesModule' },
    // { path: 'employees', loadChildren: 'app/feedback/employees/employees.module#EmployeesModule' }
    ]}
];

@NgModule({
  declarations: [FeedbackEmployerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class FeedbackEmployerModule { }
