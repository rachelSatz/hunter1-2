import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployerFormComponent } from './employer-form.component';
import { RouterModule, Routes } from '@angular/router';
import { EmployersResolve } from '../../../../shared/_resolves/employers.resolve';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: EmployerFormComponent },
  { path: ':id', component: EmployerFormComponent, resolve: { employer: EmployersResolve } },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ],
  declarations: [EmployerFormComponent],
  providers: [EmployersResolve]
})
export class EmployerFormModule { }
