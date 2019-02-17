import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkQueueComponent } from './work-queue.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule,
        MatInputModule, MatOptionModule, MatRadioModule, MatSelectModule } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';


import {EmployerFormComponent} from '../employers/employer-form/employer-form.component';
import {SystemTasksComponent} from './system-tasks/system-tasks.component';
import {PhoneCallComponent} from './phone-call/phone-call.component';
import {EmailComponent} from '../../process/process-upload/payment/email/email.component';
import {OngoingOperationComponent} from './ongoing-operation/ongoing-operation.component';

const routes: Routes = [
  { path: '', component: WorkQueueComponent},
  // { path: 'system-tasks', loadChildren: 'system-tasks/system-tasks.module#SystemTasksModule'},
  { path: 'phone-call', loadChildren: 'phone-call/phone-call.module#PhoneCallModule'},
  { path: 'emails', loadChildren: 'emails/emails.module#EmailsModule'},
  { path: 'ongoing-operation', loadChildren: 'ongoing-operation/ongoing-operation.module#OngoingOperationModule'}

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule, MatInputModule,
    MatCheckboxModule, MatRadioModule, MatSelectModule, MatButtonModule, MatIconModule,
    BdSelectModule, MatOptionModule, MatTabsModule
  ],
  declarations: [WorkQueueComponent]

  // declarations: [WorkQueueComponent, SystemTasksComponent, PhoneCallComponent, EmailComponent, OngoingOperationComponent]
})
export class WorkQueueModule { }

