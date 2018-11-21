import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule, MatInputModule } from '@angular/material';

import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';

import { CommonModule } from '@angular/common';
import { ProactiveInvoiceFormComponent } from './proactive-invoice-form.component';
import {EmployerService} from '../../../../shared/_services/http/employer.service';

const routes: Routes = [
  { path: '', component: ProactiveInvoiceFormComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule, MatInputModule,
    BdSelectModule
  ],
  declarations: [ProactiveInvoiceFormComponent],
  providers: [EmployerService]
})
export class ProactiveInvoiceFormModule { }
