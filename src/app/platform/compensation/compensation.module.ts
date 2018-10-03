import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { DataTableModule } from 'app/shared/data-table/data-table.module';

import { CompensationComponent } from './compensation.component';

import { CompensationService } from 'app/shared/_services/http/compensation.service';

const routes: Routes = [
  { path: '', component: CompensationComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BdSelectModule,
    DataTableModule
  ],
  declarations: [CompensationComponent],
  providers: [CompensationService]
})
export class CompensationModule {}
