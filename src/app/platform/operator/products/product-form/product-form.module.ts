import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from './product-form.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
import { BdSelectModule } from '../../../../../assets/js/bd-select/bd-select.module';
import { ProductResolve } from '../../../../shared/_resolves/product';
import { ProductService } from '../../../../shared/_services/http/product.service';
import { GeneralHttpService } from '../../../../shared/_services/http/general-http.service';

const routes: Routes = [
  { path: '', component: ProductFormComponent },
  { path: ':id', component: ProductFormComponent, resolve: { product: ProductResolve } }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatCheckboxModule, MatRadioModule, MatSelectModule, MatButtonModule,
    BdSelectModule, MatDividerModule,
    ReactiveFormsModule
  ],
  declarations: [ProductFormComponent],
  providers: [ProductService, ProductResolve, GeneralHttpService]
})
export class ProductFormModule { }
