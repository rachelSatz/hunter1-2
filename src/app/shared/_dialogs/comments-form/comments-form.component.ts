import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject} from '@angular/core';

import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-comments-form',
  templateUrl: './comments-form.component.html',
  styles: ['#commentsTable { height: 200px; overflow-y: auto; padding-top: 20px }'],
  animations: [ fade ]
})
export class CommentsFormComponent implements OnInit {
  comments = [];
  content: string;
  hasServerError: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<CommentsFormComponent>,
              private generalService: GeneralHttpService) { }

  ngOnInit() {
    this.comments = this.data.comments;

  }

  submit(): void {
    this.hasServerError = false;

    this.generalService.newComment(this.data.id, this.content, this.data.contentType).then(response => {
      if (response) {
        this.dialogRef.close(this.content);
      } else {
        this.hasServerError = true;
      }
    });
  }

  close() {
    this.dialogRef.close();
  }


}
