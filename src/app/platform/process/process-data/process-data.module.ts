import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessDataComponent } from './process-data.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressBarModule, MatProgressSpinnerModule,
  MatSelectModule, MatTooltipModule
} from '@angular/material';
import {BdSelectModule} from '../../../../assets/js/bd-select/bd-select.module';
import {ProcessUploadComponent} from '../process-upload/process-upload.component';
import {FileDropModule} from 'ngx-file-drop';
import { SelectDepComponent } from './select-dep/select-dep.component';

const routes: Routes = [
  { path: '', component: ProcessDataComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatButtonModule,
    BdSelectModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule,
    MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule, FileDropModule,


  ],
  declarations: [ProcessDataComponent, ProcessUploadComponent, SelectDepComponent],
  entryComponents: [SelectDepComponent]
})
export class ProcessDataModule { }
