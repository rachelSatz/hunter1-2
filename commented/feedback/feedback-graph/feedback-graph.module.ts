import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';

import { FeedbackGraphComponent } from './feedback-graph.component';
import { Select2Module } from "ng2-select2/ng2-select2";
import { EmployersSelectdModule } from "../../employers-select2/employers-select2-module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,EmployersSelectdModule,Select2Module,
    MatFormFieldModule, MatSelectModule
  ],
  declarations: [FeedbackGraphComponent],
  exports: [FeedbackGraphComponent]
})
export class FeedbackGraphModule {}
