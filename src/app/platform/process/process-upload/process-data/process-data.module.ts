import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatTooltipModule } from '@angular/material';

import { FileDropModule } from 'ngx-file-drop';

import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { ProcessDataComponent } from './process-data.component';

const routes: Routes = [
  { path: '', component: ProcessDataComponent },

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    BdSelectModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule,
    MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule, FileDropModule, MatButtonModule
],
  declarations: [ProcessDataComponent],
})
export class ProcessDataModule {}
