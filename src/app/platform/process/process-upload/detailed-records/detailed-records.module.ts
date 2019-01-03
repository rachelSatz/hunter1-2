import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailedRecordsComponent } from './detailed-records.component';
import { FileTransferComponent } from './file-transfer/file-transfer.component';
import { MatCheckboxModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatCheckboxModule
  ],
  declarations: [DetailedRecordsComponent, FileTransferComponent]
})
export class DetailedRecordsModule { }
