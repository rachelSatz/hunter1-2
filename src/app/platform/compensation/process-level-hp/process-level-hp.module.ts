import { NgModule  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatSelectModule,
  MatIconModule,
  MatAutocompleteModule
} from '@angular/material';

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

import { ProcessLevelHpComponent } from './process-level-hp.component';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import {FileDropModule} from 'ngx-file-drop';
import { FormComponent } from './form/form.component';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';



const routes: Routes = [
  { path: '', component: ProcessLevelHpComponent }
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
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    FileDropModule,
    MatAutocompleteModule,
    DatePickerModule,
    BdSelectModule,
    PipesModule,
    DataTableModule
  ],
  declarations: [
    ProcessLevelHpComponent,
    FormComponent
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
    FormComponent
  ],
})
export class ProcessLevelHpModule { }
