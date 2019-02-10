import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsComponent } from './documents.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [{path: '', component: DocumentsComponent }]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DocumentsComponent]
})
export class DocumentsModule { }
