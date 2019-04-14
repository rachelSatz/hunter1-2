import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule, MatInputModule, MatDialogModule, MatCheckboxModule, MatSelectModule  } from '@angular/material';

import { DashboardComponent } from './dashboard.component';

import { UserService } from 'app/shared/_services/http/user.service';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';

const routes: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
  imports: [
    CommonModule,
    BdSelectModule,
    MatFormFieldModule, MatInputModule, MatDialogModule, MatCheckboxModule, MatSelectModule,
    RouterModule.forChild(routes),
    FormsModule,
    DatePickerModule
  ],
  declarations: [
    DashboardComponent
  ],
  providers: [EmployerService, UserService, CompensationService],
})
export class DashboardModule { }
