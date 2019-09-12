import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes} from '@angular/router';
import { FormsModule, } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';

// import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { InvoiceService } from 'app/shared/_services/http/invoice.service';
import { NotificationService} from 'app/shared/_services/notification.service';
import { DoughnutComponent} from 'app/shared/doughnut/doughnut.component';
import { ChartsModule } from 'ng2-charts';
// import { MultiDatepickerModule } from 'app/shared/multidatepicker/multidatepicker.module';

const routes: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
  declarations: [DashboardComponent, DoughnutComponent],
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
    // DatePickerModule,
    BdSelectModule,
    ChartsModule
    // MultiDatepickerModule
  ],
  providers: [InvoiceService, NotificationService]
})
export class DashboardModule { }
