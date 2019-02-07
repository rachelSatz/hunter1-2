import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentsComponent } from './departments.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [{ path: '', component: DepartmentsComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DepartmentsComponent]
})
export class DepartmentsModule { }
