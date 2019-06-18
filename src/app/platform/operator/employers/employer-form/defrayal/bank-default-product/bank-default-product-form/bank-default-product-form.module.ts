import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

import { ContactResolve } from 'app/shared/_resolves/contact.resolve';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { BankDefaultProductFormComponent } from './bank-default-product-form.component';

const routes: Routes = [
  { path: '', component: BankDefaultProductFormComponent },
  { path: ':id', component: BankDefaultProductFormComponent}
];

@NgModule({
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
  declarations: [BankDefaultProductFormComponent],
  providers: [ContactResolve]
})
export class BankDefaultProductFormModule { }
