import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkQueueComponent } from './work-queue.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatIconModule,
  MatInputModule, MatOptionModule, MatRadioModule, MatSelectModule
} from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { SystemTasksComponent } from './system-tasks/system-tasks.component';
import { OngoingOperationComponent } from './ongoing-operation/ongoing-operation.component';
import { TimerComponent } from './timer/timer.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import {SkipTaskComponent} from './ongoing-operation/skip-task/skip-task.component';
import {DatePickerModule} from 'app/shared/app-date-picker/app-date-picker.module';
import {TimerService} from '../../../shared/_services/http/timer';
import {OperatorTasksService} from '../../../shared/_services/http/operator-tasks';

// const routes: Routes = [
//   { path: '', component: WorkQueueComponent},
//   { path: 'system-tasks', loadChildren: './system-tasks/system-tasks.module#SystemTasksModule'},
//   { path: 'phone-call', loadChildren: 'phone-call/phone-call.module#PhoneCallModule'},
//   { path: 'timer', loadChildren: 'timer/timer.module#EmailsModule'},
//   { path: 'ongoing-operation', loadChildren: 'ongoing-operation/ongoing-operation.module#OngoingOperationModule'}
//
// ];
const routes: Routes = [
  {
    path: '', component: WorkQueueComponent, children: [
      { path: 'system-tasks', component: SystemTasksComponent},
      { path: 'phone-call', component: TimerComponent},
      { path: 'emails', component: TimerComponent},
      { path: 'ongoing-operation', component: OngoingOperationComponent},
      { path: 'guidance', component: TimerComponent},
      { path: 'interruption', component: TimerComponent}
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule, MatInputModule,
    MatCheckboxModule, MatRadioModule, MatSelectModule, MatButtonModule, MatIconModule, MatDialogModule,
    BdSelectModule, MatOptionModule, MatTabsModule, DatePickerModule
  ],

  declarations: [WorkQueueComponent, SystemTasksComponent, TimerComponent, OngoingOperationComponent],
  providers: [NotificationService, TimerService, OperatorTasksService]


})
export class WorkQueueModule { }

