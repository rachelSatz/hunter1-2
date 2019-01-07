import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttachReferenceComponent } from './attach-reference/attach-reference.component';
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
import { FormsModule } from '@angular/forms';
import { DetailedFilesComponent } from './detailed-files.component';

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
  declarations: [ DetailedFilesComponent, AttachReferenceComponent],
  entryComponents: [AttachReferenceComponent]
})
export class DetailedFilesModule { }
