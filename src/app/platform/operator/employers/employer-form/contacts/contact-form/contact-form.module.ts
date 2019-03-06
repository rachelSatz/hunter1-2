import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { ContactResolve } from 'app/shared/_resolves/contact.resolve';
import { ContactFormComponent } from './contact-form.component';



const routes: Routes = [
  { path: '', component: ContactFormComponent },
  { path: ':id', component: ContactFormComponent, resolve: { contact: ContactResolve } }
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
  declarations: [ContactFormComponent],
  providers: [ContactResolve]
})
export class ContactFormModule { }
