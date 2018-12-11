import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemarksFormComponent } from './remarks-form.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule, MatInputModule} from '@angular/material';
import {BdSelectModule} from '../../../../../assets/js/bd-select/bd-select.module';

const routes: Routes = [
  { path: '', component: RemarksFormComponent }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule, MatInputModule,
    BdSelectModule
  ],
  declarations: [RemarksFormComponent]
})
export class RemarksFormModule { }
