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
import { FormsModule } from '@angular/forms';


const routes: Routes = [
      { path: '', component: ProcessUploadComponent, children: [
      { path: '', loadChildren: './process-data/process-data.module#ProcessDataModule' },
      { path: 'payment/:id', loadChildren: './payment/payment.module#PaymentModule' },
      { path: 'broadcast', loadChildren: './broadcast/broadcast.module#BroadcastModule' },
      { path: 'details', loadChildren: './shared/details/details.module#DetailsModule' }
      ]}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule, MatMenuModule,
    MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule, MatCheckboxModule,
    PipesModule, FormsModule
  ],
  declarations: [ProcessUploadComponent],
  providers: [ProcessService, GeneralHttpService,
              FilterItemsPipe]

})
export class ProcessUploadModule {}
