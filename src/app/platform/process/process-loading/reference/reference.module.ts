import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ReferenceComponent } from '../reference/reference.component';
import { MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { ProcessLoadingComponent } from '../process-loading.component';
import { BdSelectModule } from 'assets/js/bd-select/bd-select.module';


const routes: Routes = [
  { path: '', component: ReferenceComponent , children: [
      { path: '', loadChildren: 'app/shared/shared/detailed-files/detailed-files.module#DetailedFilesModule' },
      { path: 'file', loadChildren: 'app/shared/shared/detailed-files/detailed-files.module#DetailedFilesModule' },
    ]}];



@NgModule({
  declarations: [ReferenceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    BdSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule
  ],
  providers: [ProcessLoadingComponent],

})
export class ReferenceModule { }

