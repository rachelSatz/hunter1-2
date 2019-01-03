import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttachReferenceComponent } from './attach-reference/attach-reference.component';
import { MatCheckboxModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatCheckboxModule
  ],
  declarations: [AttachReferenceComponent],
  entryComponents: [AttachReferenceComponent]
})
export class DetailedFilesModule { }
