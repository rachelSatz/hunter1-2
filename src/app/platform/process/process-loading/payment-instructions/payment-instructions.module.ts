import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentInstructionsComponent } from './payment-instructions.component';
import { MatCheckboxModule, MatChipsModule, MatDialogModule, MatFormFieldModule, MatIconModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { SendFileEmailComponent } from './send-file-email/send-file-email.component';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { ProcessLoadingComponent } from 'app/platform/process/process-loading/process-loading.component';
import { GroupHistoryComponent } from './group-history/group-history.component';
import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';
import { DataTableModule } from 'app/shared/data-table/data-table.module';

const routes: Routes = [
  { path: '', component: PaymentInstructionsComponent , children: [
    { path: '', loadChildren: 'app/shared/shared/detailed-files/detailed-files.module#DetailedFilesModule' },
    { path: 'files', loadChildren: 'app/shared/shared/detailed-files/detailed-files.module#DetailedFilesModule' },
    { path: 'records', loadChildren: 'app/shared/shared/detailed-records/detailed-records.module#DetailedRecordsModule' },
    { path: 'records/:id' , loadChildren:  'app/shared/shared/detailed-records/detailed-records.module#DetailedRecordsModule'}

    ]}];

@NgModule({
  declarations: [PaymentInstructionsComponent, SendFileEmailComponent, GroupHistoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    FormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatDialogModule,
    DataTableModule,
    MatCheckboxModule
  ],
  entryComponents: [SendFileEmailComponent, GroupHistoryComponent],
  providers: [ContactService , ProcessLoadingComponent, MonthlyTransferBlockService]
})
export class PaymentInstructionsModule { }
