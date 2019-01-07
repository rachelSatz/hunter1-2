import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule, MatInputModule, MatDialogModule, MatMenuModule,
  MatProgressBarModule, MatSelectModule, MatTooltipModule, MatProgressSpinnerModule, MatCheckboxModule } from '@angular/material';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ProcessUploadComponent } from './process-upload.component';

const routes: Routes = [
  { path: '', component: ProcessUploadComponent, children: [
      { path: '', loadChildren: './process-data/process-data.module#ProcessDataModule'},
      { path: 'payment', loadChildren: './payment/payment.module#PaymentModule'},
      { path: 'detailed-files', loadChildren: './shared/detailed-files/detailed-files.module#DetailedFilesModule'}
    ]}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule, MatMenuModule,
    MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule, MatCheckboxModule
  ],
  declarations: [ProcessUploadComponent],
  providers: [ProcessService]
})
export class ProcessUploadModule {}
