import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';

import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  animations: [ fade ]
})
export class CommentsComponent implements OnInit {
  comments = [];
  comment: string;
  hasServerError: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public generalService: GeneralHttpService,
              private dialogRef: MatDialogRef<CommentsComponent>) { }

  ngOnInit() {
    this.generalService.getComments(this.data.file_id, 'groupthing').then(response => this.comments = response);
  }

  submit(): void {
    this.hasServerError = false;

    this.generalService.newComment(this.data.file_id, this.comment, 'groupthing').then(response => {
      if (response) {
        this.dialogRef.close(this.comment);
      } else {
        this.hasServerError = true;
      }
    });
  }
}
