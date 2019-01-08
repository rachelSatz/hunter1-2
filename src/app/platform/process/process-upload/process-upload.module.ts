import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule, MatInputModule, MatDialogModule,
  MatProgressBarModule, MatSelectModule, MatTooltipModule, MatProgressSpinnerModule, MatCheckboxModule } from '@angular/material';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ProcessUploadComponent } from './process-upload.component';
import { DetailedFilesComponent } from './detailed-files/detailed-files.component';

const routes: Routes = [
  { path: '', component: ProcessUploadComponent, children: [
      { path: '', loadChildren: './process-data/process-data.module#ProcessDataModule'},
      { path: 'payment', loadChildren: './payment/payment.module#PaymentModule' },
      { path: 'broadcast', loadChildren: './broadcast/broadcast.module#BroadcastModule' }

    ]}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule,
    MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule, MatCheckboxModule
  ],
  declarations: [ProcessUploadComponent, DetailedFilesComponent],
  providers: [ProcessService]
})
export class ProcessUploadModule {}
