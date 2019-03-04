import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { MatDialogModule } from '@angular/material';

import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { EmployersComponent } from './employers.component';
import { EmployerService } from 'app/shared/_services/http/employer.service';

const routes: Routes = [
  { path: '', component: EmployersComponent },
  { path: 'form', loadChildren: 'app/platform/operator/employers/employer-form/employer-form.module#EmployerFormModule' },
  { path: 'new', loadChildren: 'app/platform/operator/employers/new-employer/new-employer.module#NewEmployerModule' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule,
    MatDialogModule,
    BdSelectModule
  ],
  declarations: [EmployersComponent],
  providers: [EmployerService]
})
export class EmployersModule { }
