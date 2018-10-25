import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule, MatInputModule, MatDialogModule, MatCheckboxModule, MatSelectModule  } from '@angular/material';

import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';

import { DashboardComponent } from './dashboard.component';

import { EmployerService } from 'app/shared/_services/http/employer.service';
import { UserService } from 'app/shared/_services/http/user.service';
import { CompensationService } from 'app/shared/_services/http/compensation.service';
import {DatePickerModule} from '../../../shared/app-date-picker/app-date-picker.module';

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
