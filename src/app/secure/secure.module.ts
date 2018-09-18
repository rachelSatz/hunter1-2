import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';

import { DashboardModule } from './dashboard/dashboard.module';
import { ProcessTableModule } from './process-table/process-table.module';
import { ProcessModule } from './process/process.module';
import { SettingsModule } from './settings/settings.module';
import { FeedbackModule } from './feedback/feedback.module';

import { SecureComponent } from './secure.component';
import { EmployersSelectdModule } from "./employers-select2/employers-select2-module";
import { MonthpickerComponentModule } from "./MonthPicker/monthpicker.component-module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DashboardModule,
    ProcessTableModule,
    ProcessModule,
    FeedbackModule,
    SettingsModule,
    EmployersSelectdModule,
    MatMenuModule,MonthpickerComponentModule
  ],
  exports:[EmployersSelectdModule,MonthpickerComponentModule],
  declarations: [SecureComponent],
})
export class SecureModule {}
