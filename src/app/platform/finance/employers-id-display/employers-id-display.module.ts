import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SelectUnitService } from '../../../shared/_services/select-unit.service';
import { PlatformComponent } from '../../platform.component';
import { EmployersIdDisplayComponent } from './employers-id-display.component';
import { DoughnutComponent } from '../../../shared/doughnut/doughnut.component';
import { MatFormFieldModule,
         MatInputModule,
         MatDialogModule,
         MatCheckboxModule,
         MatSelectModule,
         MatIconModule,
         MatAutocompleteModule
} from '@angular/material';
import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';
import { BdSelectModule } from '../../../../assets/js/bd-select/bd-select.module';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: EmployersIdDisplayComponent }
];

@NgModule({
  declarations: [EmployersIdDisplayComponent, DoughnutComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
    DatePickerModule,
    BdSelectModule,
    ChartsModule
  ],
  providers: [
    SelectUnitService, PlatformComponent
  ]
})
export class EmployersIdDisplayModule { }
