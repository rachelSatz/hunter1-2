import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailedRecordsComponent } from './detailed-records.component';
import { FileTransferComponent } from './file-transfer/file-transfer.component';
import { MatCheckboxModule, MatMenuModule } from '@angular/material';
import { GroupTransferComponent } from './group-transfer/group-transfer.component';

@NgModule({
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatMenuModule
  ],
  declarations: [DetailedRecordsComponent, FileTransferComponent, GroupTransferComponent]
})
export class DetailedRecordsModule { }
