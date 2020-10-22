import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {CalcProcessesComponent} from './calc-processes.component';
import {DataTableModule} from '../../../shared/data-table/data-table.module';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';

const routes: Routes = [
  { path: '', component: CalcProcessesComponent }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule
  ],
  providers:[
    SelectUnitService
  ]
})
export class CalcProcessesModule { }
