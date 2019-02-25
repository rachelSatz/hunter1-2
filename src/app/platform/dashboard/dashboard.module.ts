import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule } from 'ng2-charts';

import { DashboardComponent } from './dashboard.component';
import {TimerService} from '../../shared/_services/http/timer';

const routes: Routes = [
  { path: '', component: DashboardComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ChartsModule
  ],
  declarations: [DashboardComponent],
  providers: [TimerService]
})
export class DashboardModule {}
