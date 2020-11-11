import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {DataTableModule} from '../../../shared/data-table/data-table.module';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';
import {PlatformComponent} from '../../platform.component';
import {EmployersIdDisplayComponent} from "./employers-id-display.component";

const routes: Routes = [
  { path: '', component: EmployersIdDisplayComponent }
];

@NgModule({
  declarations: [EmployersIdDisplayComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule
  ],
  providers:[
    SelectUnitService, PlatformComponent
  ]
})
export class EmployersIdDisplayModule { }
