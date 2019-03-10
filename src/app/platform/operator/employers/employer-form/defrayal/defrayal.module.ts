import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DefrayalComponent } from './defrayal.component';
import { DataTableModule } from 'app/shared/data-table/data-table.module';

const routes: Routes = [{ path: '', component: DefrayalComponent},
  { path: 'form',
    loadChildren: './defrayal-form/defrayal-form.module#DefrayalFormModule'}];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule
  ],
  declarations: [DefrayalComponent]
})
export class DefrayalModule { }
