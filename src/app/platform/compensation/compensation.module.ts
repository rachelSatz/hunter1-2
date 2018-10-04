import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatDialogModule, MatCheckboxModule } from '@angular/material';

import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';

import { CompensationComponent } from './compensation.component';
import { FormComponent } from './form/form.component';

import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { ProductService } from 'app/shared/_services/http/product.service';

const routes: Routes = [
  { path: '', component: CompensationComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatDialogModule, MatCheckboxModule,
    DatePickerModule,
    BdSelectModule,
    DataTableModule
  ],
  declarations: [CompensationComponent, FormComponent],
  providers: [CompensationService, DepartmentService, ProductService],
  entryComponents: [FormComponent]
})
export class CompensationModule {}
