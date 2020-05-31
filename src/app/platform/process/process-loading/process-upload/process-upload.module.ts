import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BdSelectModule } from 'assets/js/bd-select/bd-select.module';
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';

import { FileDropModule } from 'ngx-file-drop';
import { ProcessUploadComponent } from 'app/platform/process/process-loading/process-upload/process-upload.component';
import { UploadComponent } from './upload/upload.component';
import { EmailComponent } from 'app/platform/process/process-loading/process-upload/email/email.component';
import { IncorrectRowsComponent } from './incorrect-rows/incorrect-rows.component';

const routes: Routes = [
  { path: '', component: ProcessUploadComponent },
];

@NgModule({
  declarations: [ProcessUploadComponent, UploadComponent, EmailComponent, IncorrectRowsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    BdSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    FileDropModule,
    MatButtonModule
  ],
  entryComponents: [UploadComponent, EmailComponent, IncorrectRowsComponent],

})
export class ProcessUploadModule { }
