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
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { NotificationService } from 'app/shared/_services/notification.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule, MatMenuModule,
    MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule, MatCheckboxModule, MatIconModule,
    BdSelectModule
  ],
  providers: [ NotificationService]
})
export class DetailedRecordsModule { }
