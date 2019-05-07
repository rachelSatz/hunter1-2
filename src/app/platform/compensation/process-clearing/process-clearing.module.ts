import { NgModule  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatDialogModule, MatCheckboxModule,
  MatSelectModule, MatIconModule, MatAutocompleteModule } from '@angular/material';
import { MatChipsModule } from '@angular/material/chips';
import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';
import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { ProductService } from 'app/shared/_services/http/product.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { PipesModule } from 'app/shared/_pipes/pipes.module';
import { FilterItemsPipe } from 'app/shared/_pipes/filter-items.pipe';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { ProcessClearingComponent } from './process-clearing.component';
import { FormComponent } from './form/form.component';


const routes: Routes = [
  { path: '', component: ProcessClearingComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    DatePickerModule,
    DataTableModule,
    PipesModule
  ],
  declarations: [
    ProcessClearingComponent,
    FormComponent,
    // DetailsComponent,
    // AddFileComponent,
    // ExcelComponent,
    // EmployeesComponent,
    // ErrorMessageComponent
  ],
  providers: [
    CompensationService,
    DepartmentService,
    ProductService,
    NotificationService,
    ContactService,
    EmployerService,
    FilterItemsPipe,
    GeneralHttpService
  ],
  entryComponents: [
    FormComponent,
    // DetailsComponent,
    // AddFileComponent,
    // ExcelComponent,
    // EmployeesComponent,
    // ErrorMessageComponent
  ],
})
export class ProcessClearingModule {}
