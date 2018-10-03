import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule } from '@angular/material';
import { CommatizeNumberModule } from '../../shared/_pipes/commatize-number.module';
import { DataTableModule } from '../../shared/data-table/data-table.module';
import { ProcessTableComponent } from './process-table.component';
import { NotificationService } from '../../shared/_services/notification.service';
import { ProcessService } from '../../shared/_services/http/process.service';
import { ProcessFileService } from '../../shared/_services/http/process-file.service';
import { EmployerService } from '../../shared/_services/http/employer.service';
import { UserSessionService } from '../../shared/_services/user-session.service';
import { EmployersSelectdModule } from "../employers-select2/employers-select2-module";
import { Select2Module } from "ng2-select2/ng2-select2";
import { EmployersResolve } from "../../shared/_resolves/employers.resolve";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    MatProgressSpinnerModule, MatFormFieldModule, MatSelectModule,
    DataTableModule,
    CommatizeNumberModule , EmployersSelectdModule,Select2Module

  ],
  declarations: [ProcessTableComponent],
  providers: [NotificationService, ProcessService, ProcessFileService,EmployersResolve,
    EmployerService, UserSessionService]
})
export class ProcessTableModule {}
