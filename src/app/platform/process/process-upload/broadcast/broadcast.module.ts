import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule, MatDialogModule, MatMenuModule } from '@angular/material';

import { DateUpdateModule } from './date-update/date-update.module';
import { BroadcastComponent } from './broadcast.component';
import { NotificationService } from 'app/shared/_services/notification.service';

const routes: Routes = [
  { path: '', component: BroadcastComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCheckboxModule, MatDialogModule,
    FormsModule,
    DateUpdateModule,
    MatMenuModule
  ],
  declarations: [BroadcastComponent],
  providers: [NotificationService]
})
export class BroadcastModule {}
