import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessUploadComponent } from './process-upload.component';
import {RouterModule, Routes} from '@angular/router';
import { MatFormFieldModule, MatInputModule, MatDialogModule, MatCheckboxModule, MatSelectModule  } from '@angular/material';

const routes: Routes = [
  { path: '', component: ProcessUploadComponent }
];


@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule, MatInputModule, MatDialogModule, MatCheckboxModule, MatSelectModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ProcessUploadComponent]
})
export class ProcessUploadModule { }
