import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import { MatDividerModule } from '@angular/material/divider';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';

const routes: Routes = [{ path: '', component: FinanceComponent }];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatCheckboxModule, MatRadioModule, MatSelectModule, MatButtonModule,
    BdSelectModule, MatDividerModule,
    ReactiveFormsModule,
    DatePickerModule
  ],
  declarations: [FinanceComponent],
  providers: [EmployerService]
})
export class FinanceModule { }
