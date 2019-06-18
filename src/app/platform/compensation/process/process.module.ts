import { NgModule  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatCheckboxModule,
  MatSelectModule,
  MatIconModule,
  MatAutocompleteModule } from '@angular/material';

import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';
import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { ProductService } from 'app/shared/_services/http/product.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { PipesModule } from 'app/shared/_pipes/pipes.module';
import { FilterItemsPipe } from 'app/shared/_pipes/filter-items.pipe';

import { ProcessComponent } from './process.component';
import { FormComponent } from './form/form.component';
import { DetailsComponent } from './details/details.component';
import { AddFileComponent } from './add-file/add-file.component';
import { ExcelComponent } from './excel/compensation/compensation.component';
import { EmployeesComponent } from './excel/employees/employees.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { DataTableModule } from 'app/shared/data-table/data-table.module';


const routes: Routes = [
  { path: '', component: ProcessComponent },
  { path: ':id', component: ProcessComponent}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatDialogModule, MatCheckboxModule, MatSelectModule, MatChipsModule, MatIconModule,
    MatAutocompleteModule,
    DatePickerModule,
    BdSelectModule,
    DataTableModule,
    PipesModule
  ],
  declarations: [
    ProcessComponent,
    FormComponent,
    DetailsComponent,
    AddFileComponent,
    ExcelComponent,
    EmployeesComponent,
    ErrorMessageComponent
  ],
  providers: [ CompensationService, DepartmentService, ProductService, NotificationService, ContactService, EmployerService,
    FilterItemsPipe, GeneralHttpService],
  entryComponents: [
    FormComponent,
    DetailsComponent,
    AddFileComponent,
    ExcelComponent,
    EmployeesComponent,
    ErrorMessageComponent
  ],
})
export class ProcessModule {}
