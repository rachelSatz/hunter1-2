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
import { ProcessUploadEmployerComponent } from './process-upload-employer.component';
import { EmailComponent } from '../process-upload-employer/email/email.component';

const routes: Routes = [
  { path: '', component: ProcessUploadEmployerComponent },
];

@NgModule({
  declarations: [ProcessUploadEmployerComponent, EmailComponent
  ],
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
  entryComponents: [EmailComponent]
})
export class ProcessUploadEmployerModule { }
