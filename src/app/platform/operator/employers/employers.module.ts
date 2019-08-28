import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';

import { EmployersComponent } from './employers.component';

import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { NotificationService } from 'app/shared/_services/notification.service';
// import {CreatingEmployerComponent} from './creating-employer/creating-employer.component';

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
  providers: [EmployerService, NotificationService]
})
export class EmployersModule { }
