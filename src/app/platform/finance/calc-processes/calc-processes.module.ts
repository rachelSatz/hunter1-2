import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CalcProcessesComponent } from './calc-processes.component';
import { DataTableModule } from '../../../shared/data-table/data-table.module';

const routes: Routes = [
  { path: '', component: CalcProcessesComponent }
];

  @NgModule({
  declarations: [CalcProcessesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule
  ]
})
export class CalcProcessesModule { }
