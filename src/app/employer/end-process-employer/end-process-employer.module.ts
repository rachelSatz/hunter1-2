import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EndProcessEmployerComponent } from 'app/employer/end-process-employer/end-process-employer.component';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: EndProcessEmployerComponent, children: [
      { path: '', loadChildren: 'app/platform/feedback/employees/employees.module#EmployeesModule' }
    ]}];


@NgModule({
  declarations: [EndProcessEmployerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ],
  providers: [FeedbackService]

})
export class EndProcessEmployerModule { }
