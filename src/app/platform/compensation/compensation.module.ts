import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './comments/comments.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CommentsComponent],
  entryComponents: [CommentsComponent]
})
export class CompensationModule { }
