import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesComponent } from './invoices.component';
import {RouterModule, Routes} from '@angular/router';
import {DataTableModule} from 'app/shared/data-table/data-table.module';

const routes: Routes = [
  { path: '', component: InvoicesComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule,
  ],
  declarations: [InvoicesComponent]
})
export class InvoicesModule { }
