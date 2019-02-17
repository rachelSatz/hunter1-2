import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkQueueComponent } from './work-queue.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule,
        MatInputModule, MatOptionModule, MatRadioModule, MatSelectModule } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { SystemTasksComponent } from './system-tasks/system-tasks.component';
import { PhoneCallComponent } from './phone-call/phone-call.component';
import { OngoingOperationComponent } from './ongoing-operation/ongoing-operation.component';
import { EmailsComponent } from './emails/emails.component';
import { NotificationService } from 'app/shared/_services/notification.service';

const routes: Routes = [
  {
    path: '', component: WorkQueueComponent, children: [
      { path: 'system-tasks', component: SystemTasksComponent},
      { path: 'phone-call', component: PhoneCallComponent},
      { path: 'emails', component: EmailsComponent},
      { path: 'ongoing-operation', component: OngoingOperationComponent},
      { path: 'guidance', component: OngoingOperationComponent},
      { path: 'interruption', component: OngoingOperationComponent}
    ]
  }
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
  declarations: [WorkQueueComponent, SystemTasksComponent, PhoneCallComponent, EmailsComponent, OngoingOperationComponent],
  providers: [NotificationService]

})
export class WorkQueueModule { }

