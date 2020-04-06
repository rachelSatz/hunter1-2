import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
import {
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatNativeDateModule,
  MatSelectModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ReportsManagerComponent } from './reports-manager.component';


const routes: Routes = [
  { path: '', component: ReportsManagerComponent},
];

@NgModule({
  imports: [
    CommonModule,
    DataTableModule,
    RouterModule.forChild(routes),
    FormsModule,
    HttpClientModule,
    RouterModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatMenuModule,
    MatNativeDateModule, MatDatepickerModule
  ],
  declarations: [ReportsManagerComponent],

  providers: [NotificationService, DatePipe]
})

export class ReportsManagerModule { }
