import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeHistoryComponent } from 'app/platform/feedback/employee-history/employee-history.component';

const routes: Routes = [
  { path: '', component:  EmployeeHistoryComponent ,  children: [
      { path: '', loadChildren: '../employees/employees.module#EmployeesModule' },
      { path: 'employees', loadChildren: '../employees/employees.module#EmployeesModule' },
      { path: 'comments', loadChildren: '../comments/comments.module#CommentsModule' },
    ]}
];

@NgModule({
  declarations: [EmployeeHistoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class EmployeeHistoryModule { }
