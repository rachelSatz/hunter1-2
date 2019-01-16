import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
MatSnackBarModule,
MatSidenavModule,
MatListModule,
MatCheckboxModule,
MatTooltipModule,
MatMenuModule,
MatIconModule,
MatFormFieldModule,
MatInputModule,
MatSelectModule,
MatDialogModule, MatProgressSpinnerModule
} from '@angular/material';

import { DetailedFilesComponent } from './detailed-files.component';
import { NotificationService } from 'app/shared/_services/notification.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatListModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDialogModule, MatMenuModule, MatProgressSpinnerModule, MatIconModule
  ],
  exports: [DetailedFilesComponent],
  providers: [ NotificationService],
  declarations: [ DetailedFilesComponent],
})
export class DetailedFilesModule { }
