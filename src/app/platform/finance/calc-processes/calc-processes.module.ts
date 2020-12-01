import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CalcProcessesComponent } from './calc-processes.component';
import { DataTableModule } from '../../../shared/data-table/data-table.module';
import { SelectUnitService } from '../../../shared/_services/select-unit.service';
import { PlatformComponent } from '../../platform.component';

const routes: Routes = [
  { path: '', component: CalcProcessesComponent }
];

@NgModule({
  declarations: [CalcProcessesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule
  ],
  providers: [
    SelectUnitService, PlatformComponent
  ]
})
export class CalcProcessesModule { }
