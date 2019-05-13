import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { BankDefaultProductComponent } from './bank-default-product.component';

const routes: Routes = [{ path: '', component: BankDefaultProductComponent},
  { path: 'form',
    loadChildren: './bank-default-product-form/bank-default-product-form.module#BankDefaultProductFormModule'}];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule
  ],
  declarations: [BankDefaultProductComponent]
})
export class BankDefaultProductModule { }
