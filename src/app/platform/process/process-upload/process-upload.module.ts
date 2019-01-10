import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { PipesModule } from 'app/shared/_pipes/pipes.module';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { MatFormFieldModule, MatInputModule, MatDialogModule, MatMenuModule,
         MatProgressBarModule, MatSelectModule, MatTooltipModule, MatProgressSpinnerModule,
         MatCheckboxModule } from '@angular/material';
import { ProcessUploadComponent } from './process-upload.component';


const routes: Routes = [
  { path: '', component: ProcessUploadComponent, children: [
      { path: '', loadChildren: './process-data/process-data.module#ProcessDataModule'},
      { path: 'payment', loadChildren: './payment/payment.module#PaymentModule'},
      { path: 'detailed-files', loadChildren: './shared/detailed-files/detailed-files.module#DetailedFilesModule'},
      { path: 'broadcast', loadChildren: './broadcast/broadcast.module#BroadcastModule' },
      { path: 'payment', loadChildren: './payment/payment.module#PaymentModule'},
      // { path: 'detailed-files', loadChildren: './shared/detailed-files/detailed-files.module#DetailedFilesModule'}
      { path: 'payment', loadChildren: './payment/payment.module#PaymentModule' },
      { path: 'broadcast', loadChildren: './broadcast/broadcast.module#BroadcastModule' }
      // { path: 'detailed-files', loadChildren: './shared/detailed-files/detailed-files.module#DetailedFilesModule'}

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
  providers: [ProcessService, GeneralHttpService]
})
export class ProcessUploadModule {}
