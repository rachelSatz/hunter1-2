import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
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

import { DepositsReportComponent } from './deposits-report.component';
import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { PipesModule } from 'app/shared/_pipes/pipes.module';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { NotificationService} from 'app/shared/_services/notification.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { FilterItemsPipe } from 'app/shared/_pipes/filter-items.pipe';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { DepositsReportService } from 'app/shared/_services/http/deposits-report.service';
import { ProductService } from 'app/shared/_services/http/product.service';
import { FormComponent } from './form/form.component';


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
    DataTableModule,
    PipesModule
  ],
  declarations: [DepositsReportComponent, FormComponent],
  providers: [ DepartmentService, ProductService, NotificationService, ContactService, EmployerService,
    FilterItemsPipe, GeneralHttpService, DepositsReportService],
  entryComponents: [FormComponent]
})
export class DepositsReportModule { }
