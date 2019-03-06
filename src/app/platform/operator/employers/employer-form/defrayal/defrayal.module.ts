import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefrayalComponent } from './defrayal.component';
import { RouterModule, Routes } from '@angular/router';
import {DataTableModule} from '../../../../../shared/data-table/data-table.module';

const routes: Routes = [{ path: '', component: DefrayalComponent }];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule
  ],
  declarations: [DefrayalComponent]
})
export class DefrayalModule { }
