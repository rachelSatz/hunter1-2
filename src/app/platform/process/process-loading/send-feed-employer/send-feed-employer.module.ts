import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SendFeedEmployerComponent } from './send-feed-employer.component';
import { FormsModule } from '@angular/forms';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';

const routes: Routes = [
  { path: '', component: SendFeedEmployerComponent, children: [
      { path: '', loadChildren: 'app/platform/feedback/employees/employees.module#EmployeesModule' }
    ]}];

@NgModule({
  declarations: [SendFeedEmployerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ],
  providers: [FeedbackService]

})
export class SendFeedEmployerModule { }
