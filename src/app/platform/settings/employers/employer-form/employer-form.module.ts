import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployerFormComponent } from './employer-form.component';
import {RouterModule, Routes } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule, MatInputModule} from '@angular/material';
import {BdSelectModule} from '../../../../../assets/js/bd-select/bd-select.module';
import {EmployersResolve} from '../../../../shared/_resolves/employers.resolve';
import {EmployerService} from '../../../../shared/_services/http/employer.service';

const routes: Routes = [
  { path: '', component: EmployerFormComponent },
  { path: ':id', component: EmployerFormComponent, resolve: { employer: EmployersResolve } }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule, MatInputModule,
    BdSelectModule
  ],
  declarations: [EmployerFormComponent],
  providers: [EmployerService, EmployersResolve]

})
export class EmployerFormModule { }
