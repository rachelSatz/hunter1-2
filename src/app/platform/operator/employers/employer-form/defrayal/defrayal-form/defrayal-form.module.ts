import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DefrayalFormComponent } from './defrayal-form.component';
import { ProductService } from 'app/shared/_services/http/product.service';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { EmployerBankAccountResolve } from 'app/shared/_resolves/employers.resolve';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: DefrayalFormComponent },
  { path: ':id', component: DefrayalFormComponent, resolve: { employerBankAccount: EmployerBankAccountResolve }}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BdSelectModule,
    FormsModule
  ],
  declarations: [DefrayalFormComponent],
  providers: [ProductService, EmployerBankAccountResolve]
})
export class DefrayalFormModule { }
