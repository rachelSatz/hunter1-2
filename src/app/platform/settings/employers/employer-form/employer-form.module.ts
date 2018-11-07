import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployerFormComponent } from './employer-form.component';
import {RouterModule, Routes } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
import {BdSelectModule} from 'app/../assets/js/bd-select/bd-select.module';
import {EmployersResolve} from 'app/shared/_resolves/employers.resolve';
import {EmployerService} from 'app/shared/_services/http/employer.service';
import {GeneralHttpService} from '../../../../shared/_services/http/general-http.service';

const routes: Routes = [
  { path: '', component: EmployerFormComponent },
  { path: ':id', component: EmployerFormComponent, resolve: { employer: EmployersResolve } }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatCheckboxModule, MatRadioModule, MatSelectModule, MatButtonModule, MatIconModule,
    BdSelectModule
  ],
  declarations: [EmployerFormComponent],
  providers: [EmployerService, EmployersResolve, GeneralHttpService]

})
export class EmployerFormModule { }
