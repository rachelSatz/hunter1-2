import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {  FormsModule } from '@angular/forms';
import {  RouterModule, Routes } from '@angular/router';

import { ProcessTableComponent } from './process-table.component';

import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';

const routes: Routes = [
  { path: '', component: ProcessTableComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    DataTableModule
  ],
  declarations: [ProcessTableComponent],
  providers: [ProcessService, NotificationService, GeneralHttpService],
})
export class ProcessTableModule { }
