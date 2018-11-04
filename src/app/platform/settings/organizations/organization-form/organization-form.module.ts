import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';

import { OrganizationFormComponent } from './organization-form.component';

import { OrganizationResolve } from 'app/shared/_resolves/organization.resolve';



const routes: Routes = [
  { path: '', component: OrganizationFormComponent },
  { path: ':id', component: OrganizationFormComponent, resolve: { organization: OrganizationResolve } }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule, MatInputModule, MatCheckboxModule, MatRadioModule, MatSelectModule, MatButtonModule, MatIconModule,
    ReactiveFormsModule
  ],
  declarations: [OrganizationFormComponent],
  providers: [OrganizationResolve]
})
export class OrganizationFormModule { }
