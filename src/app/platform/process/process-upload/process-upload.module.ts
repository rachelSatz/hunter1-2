import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  MatFormFieldModule, MatInputModule, MatDialogModule, MatMenuModule,
  MatProgressBarModule, MatSelectModule, MatTooltipModule, MatProgressSpinnerModule,
  MatCheckboxModule, MatChipsModule, MatIconModule
} from '@angular/material';

import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { FilterItemsPipe } from 'app/shared/_pipes/filter-items.pipe';
import { ProcessUploadComponent } from './process-upload.component';
import { PipesModule } from 'app/shared/_pipes/pipes.module';
import { DocumentService } from 'app/shared/_services/http/document.service';

const routes: Routes = [
              { path: '', component: ProcessUploadComponent ,  children: [
                  { path: '', loadChildren: './process-data/process-data.module#ProcessDataModule' },
                  { path: 'payment/:id', loadChildren: './payment/payment.module#PaymentModule' },
                  { path: 'broadcast', loadChildren: './broadcast/broadcast.module#BroadcastModule' },
                  { path: 'details', loadChildren: './shared/details.module#DetailsModule' }
                  ]}
                  ];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule, MatMenuModule,
    MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule, MatCheckboxModule,
    PipesModule, FormsModule, MatChipsModule, MatIconModule
  ],
  declarations: [ ProcessUploadComponent ],
  providers: [ ProcessService, GeneralHttpService, FilterItemsPipe, DocumentService ]

})
export class ProcessUploadModule {}
