import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule, MatInputModule, MatDialogModule, MatMenuModule,
         MatProgressBarModule, MatSelectModule, MatTooltipModule, MatProgressSpinnerModule,

         MatCheckboxModule } from '@angular/material';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { PipesModule } from 'app/shared/_pipes/pipes.module';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { FilterItemsPipe } from 'app/shared/_pipes/filter-items.pipe';

import { ProcessUploadComponent } from './process-upload.component';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import {DetailedFilesComponent} from './shared/detailed-files/detailed-files.component';
import {DetailedRecordsComponent} from './shared/detailed-records/detailed-records.component';


const routes: Routes = [
      { path: '', component: ProcessUploadComponent, children: [
      { path: '', loadChildren: './process-data/process-data.module#ProcessDataModule' },
      { path: 'payment', loadChildren: './payment/payment.module#PaymentModule' },
      { path: 'broadcast', loadChildren: './broadcast/broadcast.module#BroadcastModule' },
    ]}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule, MatMenuModule,
    MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule, MatCheckboxModule,
    PipesModule
  ],
  declarations: [ProcessUploadComponent],
  providers: [ProcessService, GeneralHttpService, ProcessDataService, FilterItemsPipe, DetailedFilesComponent, DetailedRecordsComponent]

})
export class ProcessUploadModule {}
