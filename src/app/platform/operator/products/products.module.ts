import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { RouterModule, Routes } from '@angular/router';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { MatDialogModule } from '@angular/material';
import { BdSelectModule } from '../../../../assets/js/bd-select/bd-select.module';
import { ProductService } from 'app/shared/_services/http/product.service';
import { NotificationService } from '../../../shared/_services/notification.service';

const routes: Routes = [
  { path: '', component: ProductsComponent},
  { path: 'form', loadChildren: 'app/platform/operator/products/product-form/product-form.module#ProductFormModule' }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule,
    MatDialogModule,
    BdSelectModule
  ],
  declarations: [ProductsComponent],
  providers: [ProductService, NotificationService]
})
export class ProductsModule { }
