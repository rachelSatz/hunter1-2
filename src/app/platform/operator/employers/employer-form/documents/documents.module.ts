import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsComponent } from './documents.component';
import { RouterModule, Routes } from '@angular/router';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { DocumentService } from 'app/shared/_services/http/document.service';
import { NotificationService } from 'app/shared/_services/notification.service';
// import { AddDocumentComponent } from './add-document/add-document.component';

const routes: Routes = [{path: '', component: DocumentsComponent }]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule
  ],
  declarations: [DocumentsComponent],
  providers: [DocumentService, NotificationService],
  // entryComponents: [AddDocumentComponent]

})
export class DocumentsModule {
}
