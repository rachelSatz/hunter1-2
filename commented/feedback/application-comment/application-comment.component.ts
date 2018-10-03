 
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-application-comment',
  templateUrl: './application-comment.component.html'
})
export class ApplicationCommentComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public Data: any)  {
    console.log(Data.IsDisabled)
  }
}
