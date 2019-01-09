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
import { RouterModule, Routes } from '@angular/router';

import { DetailedFilesComponent } from './detailed-files.component';
import { NotificationService } from 'app/shared/_services/notification.service';

const routes: Routes = [
  { path: '', component: DetailedFilesComponent },

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule, MatMenuModule,
    MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule, MatCheckboxModule, MatIconModule
  ],
  providers: [ NotificationService],
  declarations: [ DetailedFilesComponent],
})
export class DetailedFilesModule { }
