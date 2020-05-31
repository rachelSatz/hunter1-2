import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { FilterItemsPipe } from 'app/shared/_pipes/filter-items.pipe';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { DocumentService } from 'app/shared/_services/http/document.service';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { ProcessLoadingComponent } from './process-loading.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { AttachReferenceComponent } from './attach-reference/attach-reference.component';
import { DocumentArchiveComponent } from './document-archive/document-archive.component';
import {
  MatDialogModule,
  MatFormFieldModule,
} from '@angular/material';
import { FileDropModule } from 'ngx-file-drop';
import { DepartmentService } from 'app/shared/_services/http/department.service';

const routes: Routes = [
  { path: '', component: ProcessLoadingComponent,  children: [
      { path: '', loadChildren: './process-upload/process-upload.module#ProcessUploadModule' },
      { path: 'payment-instructions', loadChildren: './payment-instructions/payment-instructions.module#PaymentInstructionsModule' },
      { path: 'reference', loadChildren: './reference/reference.module#ReferenceModule' },
      { path: 'broadcast', loadChildren: './broadcast/broadcast.module#BroadcastModule' },
      { path: 'feedback', loadChildren: './feedback/feedback.module#FeedbackModule' },
      { path: 'send-feed-employer', loadChildren: './send-feed-employer/send-feed-employer.module#SendFeedEmployerModule' },
      { path: 'records', loadChildren: './shared/detailed-records/detailed-records.module#DetailedRecordsModule' },
    ]}
];


@NgModule({
  declarations: [
    ProcessLoadingComponent,
    AttachReferenceComponent,
    DocumentArchiveComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FileDropModule,
    MatFormFieldModule,
    MatDialogModule,
    FormsModule,
  ],
  providers: [
    ProcessService,
    GeneralHttpService,
    FilterItemsPipe,
    DocumentService,
    NotificationService,
    DepartmentService],
  entryComponents: [
    AttachReferenceComponent,
    DocumentArchiveComponent]

})
export class ProcessLoadingModule { }
