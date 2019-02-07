import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentsComponent } from './departments.component';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { DepartmentFormComponent } from './department-form/department-form.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: DepartmentsComponent },
  { path: 'form',
    loadChildren: 'app/platform/operator/employers/employer-form/employer-form/departments/departments-form.module#DepartmentsFormModule' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule
  ],
  declarations: [DepartmentsComponent, DepartmentFormComponent]
})
export class DepartmentsModule {


}
