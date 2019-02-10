import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceComponent } from './finance.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatSelectModule} from '@angular/material';
import { BdSelectModule } from '../../../../../../assets/js/bd-select/bd-select.module';

const routes: Routes = [{ path: '', component: FinanceComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatCheckboxModule, MatRadioModule, MatSelectModule, MatButtonModule,
    BdSelectModule
  ],
  declarations: [FinanceComponent]
})
export class FinanceModule { }
