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

import { DetailedFilesComponent } from './detailed-files.component';
import { NotificationService } from 'app/shared/_services/notification.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDialogModule, MatMenuModule, MatProgressBarModule,
    MatTooltipModule, MatProgressSpinnerModule, MatCheckboxModule, MatIconModule
  ],
  exports: [DetailedFilesComponent],
  providers: [ NotificationService],
  declarations: [ DetailedFilesComponent],
})
export class DetailedFilesModule { }
