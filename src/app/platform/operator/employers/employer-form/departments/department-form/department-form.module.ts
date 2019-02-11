import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';

import { DepartmentFormComponent } from './department-form.component';
import { DepartmentsResolve } from 'app/shared/_resolves/department.resolve';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';


const routes: Routes = [
  { path: '', component: DepartmentFormComponent },
  { path: ':id', component: DepartmentFormComponent, resolve: { department: DepartmentsResolve } }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule, MatInputModule,
    MatCheckboxModule, MatRadioModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    BdSelectModule
  ],
  declarations: [DepartmentFormComponent],
  providers: [DepartmentsResolve]
})
export class DepartmentFormModule { }
