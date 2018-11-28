import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { DataTableModule } from 'app/shared/data-table/data-table.module';

import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { OrganizationService } from 'app/shared/_services/http/organization.service';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { EmployersComponent } from './employers.component';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { ExcelEmployersComponent } from './excel-employers/excel-employers.component';
import {PlatformComponent} from 'app/platform/platform.component';

const routes: Routes = [
  { path: '', component: EmployersComponent },
  { path: 'form', loadChildren: 'app/platform/settings/employers/employer-form/employer-form.module#EmployerFormModule' }
];



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule,
    MatDialogModule,
    BdSelectModule
  ],
  declarations: [EmployersComponent, ExcelEmployersComponent],
  providers: [EmployerService, CompensationService, OrganizationService, PlatformComponent],
  entryComponents: [ExcelEmployersComponent]
})
export class EmployersModule { }
