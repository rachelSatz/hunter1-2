import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';;
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {JobDetailesComponent} from './job-detailes.component';
const routes: Routes = [
  { path: '', component: JobDetailesComponent}

];
@NgModule({
  declarations: [JobDetailesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class JobDetailsModule { }


