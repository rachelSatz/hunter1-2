import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule , FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FinanceComponent } from './finance.component';
import { RouterModule, Routes } from '@angular/router';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
import { BdSelectModule } from '../../../../../../assets/js/bd-select/bd-select.module';
import { EmployerService } from 'app/shared/_services/http/employer.service';

const routes: Routes = [{ path: '', component: FinanceComponent }];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatCheckboxModule, MatRadioModule, MatSelectModule, MatButtonModule,
    BdSelectModule,
    ReactiveFormsModule
  ],
  declarations: [FinanceComponent],
  providers: [EmployerService]
})
export class FinanceModule { }
