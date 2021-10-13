import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {JobProcessComponent} from './job-process.component';
const routes: Routes = [
  { path: '', component: JobProcessComponent}

];
@NgModule({
  declarations: [JobProcessComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class JobProcessModule { }
