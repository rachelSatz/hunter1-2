import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { DepartmentsComponent } from './departments.component';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { DepartmentService } from 'app/shared/_services/http/department.service';

const routes: Routes = [
  { path: '', component: DepartmentsComponent },
  { path: 'form',
     loadChildren: 'app/platform/operator/employers/employer-form' +
       '/departments/department-form/department-form.module#DepartmentFormModule'}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule
  ],
  declarations: [DepartmentsComponent],
  providers: [DepartmentService],
})
export class DepartmentsModule {


}
