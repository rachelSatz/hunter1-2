import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageFormComponent } from './message-form/message-form.component';
import { RouterModule, Routes } from '@angular/router';
import { MessageService } from 'app/shared/_services/http/message.service';
import { HttpClientModule } from '@angular/common/http';
import { NotificationService } from 'app/shared/_services/notification.service';
import { MessagesComponent } from 'app/platform/operator/messages/messages.component';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatProgressSpinnerModule } from '@angular/material';
import { FileDropModule } from 'ngx-file-drop';

const routes: Routes = [
  { path: '', component: MessagesComponent},
  // { path: 'form', loadChildren: 'app/platform/operator/messages/message-form/message-form.module#MessageFormModule' }
];

@NgModule({
  imports: [
    CommonModule,
    DataTableModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    RouterModule,
    FormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    FileDropModule
    ],
  declarations: [MessagesComponent, MessageFormComponent],
  providers: [MessageService, NotificationService, { provide: MAT_DIALOG_DATA, useValue: [] } ],
  entryComponents: [MessageFormComponent]
})
export class MessagesModule { }
