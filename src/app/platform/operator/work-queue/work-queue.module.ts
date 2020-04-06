import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule, Routes } from '@angular/router';

import { TimerComponent } from './timer/timer.component';
import { WorkQueueComponent } from './work-queue.component';

import { TimerService } from 'app/shared/_services/http/timer';
import { PlanService } from 'app/shared/_services/http/plan.service';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { SystemTasksComponent } from './system-tasks/system-tasks.component';
import { OperatorTasksService } from 'app/shared/_services/http/operator-tasks';
import { NotificationService } from 'app/shared/_services/notification.service';
import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';
import { OngoingOperationComponent } from './ongoing-operation/ongoing-operation.component';


const routes: Routes = [
  {
    path: '', component: WorkQueueComponent, children: [
      { path: 'system-tasks', component: SystemTasksComponent},
      { path: 'phone-call', component: TimerComponent},
      { path: 'emails', component: TimerComponent},
      { path: 'ongoing-operation', component: OngoingOperationComponent},
      { path: 'guidance', component: TimerComponent},
      { path: 'break', component: TimerComponent}
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
  providers: [NotificationService, TimerService, OperatorTasksService, PlanService],

})
export class WorkQueueModule { }

