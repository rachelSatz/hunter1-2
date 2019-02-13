import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';

const routes: Routes = [{ path: '', component: ReportsComponent }];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatCheckboxModule, MatInputModule, MatSelectModule
  ],
  declarations: [ReportsComponent]
})
export class ReportsModule { }
