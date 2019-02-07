import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceComponent } from './finance.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: FinanceComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FinanceComponent]
})
export class FinanceModule { }
