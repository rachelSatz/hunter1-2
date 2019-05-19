import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { CommonModule } from '@angular/common';

import { ContactResolve } from 'app/shared/_resolves/contact.resolve';
import { BankDefaultProductFormComponent } from './bank-default-product-form.component';
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
import { BdSelectModule } from '../../../../../../../../assets/js/bd-select/bd-select.module';
import {ContactService} from '../../../../../../../shared/_services/http/contact.service';

const routes: Routes = [
  { path: '', component: BankDefaultProductFormComponent },
  { path: ':id', component: BankDefaultProductFormComponent, resolve: { contact: ContactResolve } }
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
  providers: [ContactResolve, ContactService]
})
export class BankDefaultProductFormModule { }
