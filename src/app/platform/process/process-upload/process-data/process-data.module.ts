import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FileDropModule } from 'ngx-file-drop';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule,
         MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { ProcessDataComponent } from './process-data.component';
import { SelectDepComponent } from './select-dep/select-dep.component';

const routes

: Routes = [
  { path: '', component: ProcessDataComponent },

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    BdSelectModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule,
    MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule, FileDropModule,MatButtonModule
],

  declarations: [ProcessDataComponent , SelectDepComponent],
  entryComponents: [SelectDepComponent]
})
export class ProcessDataModule {}
