import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentInstructionsComponent } from './payment-instructions.component';
import { MatChipsModule, MatDialogModule, MatFormFieldModule, MatIconModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { SendFileEmailComponent } from './send-file-email/send-file-email.component';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { ProcessLoadingComponent } from 'app/platform/process/process-loading/process-loading.component';

const routes: Routes = [
  { path: '', component: PaymentInstructionsComponent , children: [
    { path: '', loadChildren: '../shared/detailed-files/detailed-files.module#DetailedFilesModule' },
    { path: 'files', loadChildren: '../shared/detailed-files/detailed-files.module#DetailedFilesModule' },
    { path: 'records', loadChildren: '../shared/detailed-records/detailed-records.module#DetailedRecordsModule' },
    { path: 'records/:id' , loadChildren:  '../shared/detailed-records/detailed-records.module#DetailedRecordsModule'}

    ]}];

@NgModule({
  declarations: [PaymentInstructionsComponent, SendFileEmailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    FormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatDialogModule
  ],
  entryComponents: [SendFileEmailComponent],
  providers: [ContactService , ProcessLoadingComponent]
})
export class PaymentInstructionsModule { }
