import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatDialogModule, MatCheckboxModule, MatSelectModule } from '@angular/material';

import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';
import { PipesModule } from 'app/shared/_pipes/pipes.module';

import { CompensationComponent } from './compensation.component';
import { FormComponent } from './form/form.component';
import { CommentsComponent } from './comments/comments.component';
import { DetailsComponent } from './details/details.component';
import { AddFileComponent } from './add-file/add-file.component';
import { SendToComponent } from './send-to/send-to.component';
import { InquiriesComponent } from './inquiries/inquiries.component';

import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { ProductService } from 'app/shared/_services/http/product.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import {ContactService} from '../../shared/_services/http/contact.service';

const routes: Routes = [
  { path: '', component: CompensationComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatDialogModule, MatCheckboxModule, MatSelectModule,
    PipesModule,
    DatePickerModule,
    BdSelectModule,
    DataTableModule
  ],
  declarations: [
    CompensationComponent,
    FormComponent,
    CommentsComponent,
    DetailsComponent,
    AddFileComponent,
    SendToComponent,
    InquiriesComponent
  ],
  providers: [CompensationService, DepartmentService, ProductService, NotificationService, ContactService],
  entryComponents: [
    FormComponent,
    CommentsComponent,
    DetailsComponent,
    AddFileComponent,
    SendToComponent,
    InquiriesComponent
  ]
})
export class CompensationModule {}
