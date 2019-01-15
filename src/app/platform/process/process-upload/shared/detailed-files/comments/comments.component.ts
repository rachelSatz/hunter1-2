import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GeneralHttpService } from '../../../../../../shared/_services/http/general-http.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        opacity: '0'
      })),
      state('active', style({
        display: '*',
        opacity: '1'
      })),
      transition('active => inactive', animate('0ms')),
      transition('inactive => active', animate('200ms'))
    ])
  ]
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
