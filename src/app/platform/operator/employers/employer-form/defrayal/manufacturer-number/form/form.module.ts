import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ContactResolve } from 'app/shared/_resolves/contact.resolve';
import { FormComponent } from './form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
import {BdSelectModule} from '../../../../../../../../assets/js/bd-select/bd-select.module';
import {DepartmentService} from '../../../../../../../shared/_services/http/department.service';

const routes: Routes = [
  { path: '', component: FormComponent },
  { path: ':id', component: FormComponent, resolve: { contact: ContactResolve } }
];

@NgModule({
  declarations: [ FormComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule, MatInputModule,
    MatCheckboxModule, MatRadioModule,
    MatProgressSpinnerModule,
    MatSelectModule, MatButtonModule,
    MatIconModule, MatAutocompleteModule,
    BdSelectModule,
    ReactiveFormsModule
  ],
  providers: [DepartmentService, ContactResolve],
})
export class FormModule { }
