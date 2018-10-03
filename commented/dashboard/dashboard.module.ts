import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { MatFormFieldModule, MatInputModule, MatSelectModule,
         MatDatepickerModule, MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material';
import { FeedbackGraphModule } from '../feedback/feedback-graph/feedback-graph.module';

import { DashboardComponent } from './dashboard.component';
import { EmployersSelectdModule } from "../employers-select2/employers-select2-module";
import { Select2Module } from "ng2-select2/ng2-select2";
import { AppFeedbackGraphOnlyComponent } from "./app-feedback-graph-only/app-feedback-graph-only.component";
import { ServiceDashboardService } from "../../shared/_services/service-dashboard.service";
import { MonthpickerComponent } from "../MonthPicker/monthpicker.component";
import { MonthpickerComponentModule } from "../MonthPicker/monthpicker.component-module";




@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,MatDatepickerModule, MatNativeDateModule,
    FormsModule,
    ChartsModule,
    MatInputModule, MatFormFieldModule, MatSelectModule,
    FeedbackGraphModule, ReactiveFormsModule,
    EmployersSelectdModule,Select2Module,MonthpickerComponentModule
  
  ],
  declarations: [DashboardComponent, AppFeedbackGraphOnlyComponent],
  exports:[AppFeedbackGraphOnlyComponent],
  providers: [ ServiceDashboardService,{ provide: MAT_DATE_LOCALE, useValue: 'he-IL' }]
})
export class DashboardModule {}
