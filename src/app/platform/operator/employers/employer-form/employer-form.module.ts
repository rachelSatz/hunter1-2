import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployerFormComponent } from './employer-form.component';
import {RouterModule, Routes} from '@angular/router';
import {EmployersResolve} from '../../../../shared/_resolves/employers.resolve';
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
import {BdSelectModule} from '../../../../../assets/js/bd-select/bd-select.module';
import {EmployerService} from '../../../../shared/_services/http/employer.service';
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
