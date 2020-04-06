import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatSnackBarModule,
  MatSidenavModule,
  MatListModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatMenuModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDialogModule, MatProgressSpinnerModule
} from '@angular/material';

import { NotificationService } from 'app/shared/_services/notification.service';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { DetailedFilesComponent } from './detailed-files.component';


const route: Routes = [
  { path: '', component: DetailedFilesComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(route),
    MatSnackBarModule,
    MatSidenavModule,
    MatListModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatIconModule,
    DataTableModule
  ],
  providers: [ NotificationService ],
  declarations: [ DetailedFilesComponent ],
})
export class DetailedFilesModule { }
