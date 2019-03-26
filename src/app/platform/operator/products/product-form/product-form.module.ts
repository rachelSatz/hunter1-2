import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductResolve } from 'app/shared/_resolves/product';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from 'app/shared/_services/http/product.service';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { RedirectedProductComponent } from './redirected-product/redirected-product.component';

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
