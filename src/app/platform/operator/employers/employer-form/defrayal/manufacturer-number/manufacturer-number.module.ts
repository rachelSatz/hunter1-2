import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { ManufacturerNumberComponent } from './manufacturer-number.component';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import {ContactService} from '../../../../../../shared/_services/http/contact.service';


const routes: Routes = [
    { path: '', component: ManufacturerNumberComponent},
    { path: 'form', loadChildren: './form/form.module#FormModule'}
  ];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule
  ],
  declarations: [ManufacturerNumberComponent],
  providers: [DepartmentService, ContactService]
})
export class ManufacturerNumberModule { }
