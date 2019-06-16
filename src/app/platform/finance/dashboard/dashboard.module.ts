import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';
import { ChartsModule } from 'angular-bootstrap-md';

import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { InvoiceService } from 'app/shared/_services/http/invoice.service';
import { NotificationService} from 'app/shared/_services/notification.service';

const routes: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatDialogModule, MatCheckboxModule, MatSelectModule, MatIconModule,
    MatAutocompleteModule,
    DatePickerModule,
    DataTableModule,
    BdSelectModule,
    ChartsModule
  ],
  providers: [InvoiceService, NotificationService]
})
export class DashboardModule { }
