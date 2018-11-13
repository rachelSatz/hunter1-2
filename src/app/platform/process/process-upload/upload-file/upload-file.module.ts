import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { MatFormFieldModule, MatInputModule, MatDialogModule,
  MatProgressBarModule, MatSelectModule, MatTooltipModule, MatProgressSpinnerModule } from '@angular/material';
import { FileDropModule } from 'ngx-file-drop';
import { FormsModule } from '@angular/forms';

import { UploadFileComponent } from './upload-file.component';

const routes: Routes = [
  { path: '', component: UploadFileComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule,
    MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule, FileDropModule
  ],
  declarations: [UploadFileComponent]
})
export class UploadFileModule {}
