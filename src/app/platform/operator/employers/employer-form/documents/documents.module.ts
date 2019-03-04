import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsComponent } from './documents.component';
import { RouterModule, Routes } from '@angular/router';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { DocumentService } from 'app/shared/_services/http/document.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { AddDocumentComponent } from './add-document/add-document.component';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { MatDialogModule } from '@angular/material';

const routes: Routes = [{path: '', component: DocumentsComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule,
    MatDialogModule,
    BdSelectModule
  ],
  declarations: [DocumentsComponent, AddDocumentComponent],
  entryComponents: [AddDocumentComponent],
  providers: [DocumentService, NotificationService]

})
export class DocumentsModule {
}
