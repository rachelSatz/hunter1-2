import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { DepartmentFormComponent } from './department-form.component';
import { DepartmentsResolve } from 'app/shared/_resolves/department.resolve';


const routes: Routes = [
  { path: '', component: DepartmentFormComponent },
  { path: ':id', component: DepartmentFormComponent, resolve: { department: DepartmentsResolve } }
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class DepartmentFormModule { }
