import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  MatAutocompleteModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';

import { FormComponent } from './form/form.component';
import { PipesModule } from 'app/shared/_pipes/pipes.module';
import { AddFileComponent } from './add-file/add-file.component';
import { DepositsReportComponent } from './deposits-report.component';
import { FilterItemsPipe } from 'app/shared/_pipes/filter-items.pipe';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { ProductService } from 'app/shared/_services/http/product.service';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { DocumentService } from 'app/shared/_services/http/document.service';
import { NotificationService} from 'app/shared/_services/notification.service';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';
import { DepositsReportService } from 'app/shared/_services/http/deposits-report.service';
import { RequestDepositsReportComponent } from './excel/request-deposits-report/request-deposits-report.component';
import { DataTableModule } from 'app/shared/data-table/data-table.module';


const routes: Routes = [
  { path: '', component: DepositsReportComponent }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatDialogModule, MatCheckboxModule, MatSelectModule, MatChipsModule, MatIconModule,
    MatAutocompleteModule,
    DatePickerModule,
    BdSelectModule,
    PipesModule,
    DataTableModule
  ],
  declarations: [DepositsReportComponent, FormComponent, AddFileComponent, RequestDepositsReportComponent],
  providers: [ DepartmentService, ProductService, NotificationService, ContactService, EmployerService,
    FilterItemsPipe, GeneralHttpService, DepositsReportService, CompensationService, DocumentService],
  entryComponents: [FormComponent, AddFileComponent, RequestDepositsReportComponent]
})
export class DepositsReportModule { }
