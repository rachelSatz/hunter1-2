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
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  { path: '', component: DetailedFilesComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule, MatMenuModule,
    MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule, MatCheckboxModule, MatIconModule
  ],
  exports: [DetailedFilesComponent],
  providers: [ NotificationService],
  declarations: [ DetailedFilesComponent],
})
export class DetailedFilesModule { }
