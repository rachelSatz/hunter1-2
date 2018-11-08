import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule, MatInputModule, MatDialogModule,
  MatProgressBarModule, MatSelectModule, MatTooltipModule, MatProgressSpinnerModule } from '@angular/material';
import { FileDropModule   } from 'ngx-file-drop';

import {Routes} from '@angular/router';
import { ProcessUploadComponent } from './process-upload.component';

const routes: Routes = [
  { path: '', component: ProcessUploadComponent }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule,
    MatProgressBarModule, MatTooltipModule ,
     MatProgressSpinnerModule , FileDropModule
  ],
  declarations: [ProcessUploadComponent]
})
export class ProcessUploadModule { }
