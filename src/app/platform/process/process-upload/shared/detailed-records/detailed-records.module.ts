import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatCheckboxModule,
  MatMenuModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDialogModule, MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule
} from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';

import { NotificationService } from 'app/shared/_services/notification.service';
import { DetailedRecordsComponent } from './detailed-records.component';
import { DataTableModule } from 'app/shared/data-table/data-table.module';

const route: Routes = [{ path: '', component: DetailedRecordsComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule, MatMenuModule,
    MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule, MatCheckboxModule, MatIconModule,
    BdSelectModule, DataTableModule
  ],
  providers: [ NotificationService],
  declarations: [DetailedRecordsComponent]
})
export class DetailedRecordsModule { }
