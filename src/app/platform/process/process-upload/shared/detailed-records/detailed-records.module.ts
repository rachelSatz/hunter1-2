import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatCheckboxModule,
  MatMenuModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDialogModule, MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule
} from '@angular/material';

import { NotificationService } from 'app/shared/_services/notification.service';
import { DetailedRecordsComponent } from './detailed-records.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule, MatMenuModule,
    MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule, MatCheckboxModule, MatIconModule
  ],
  declarations: [DetailedRecordsComponent],
  exports: [DetailedRecordsComponent],
  providers: [ NotificationService]
})
export class DetailedRecordsModule { }
