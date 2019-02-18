import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';

@Component({
  selector: 'app-comments-form',
  templateUrl: './comments-form.component.html',
  styles: ['#commentsTable { height: 200px; overflow-y: auto; padding-top: 20px }'],
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
export class CommentsFormComponent implements OnInit {
  comments = [];
  comment: string;
  hasServerError: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<CommentsFormComponent>,
              private generalService: GeneralHttpService) { }

  ngOnInit() {
    this.generalService.getComments(this.data.id, this.data.contentType)
      .then(response => this.comments = response);
  }
  submit(): void {
    this.hasServerError = false;

    this.generalService.newComment(this.data.id, this.comment, this.data.contentType).then(response => {
      if (response) {
        this.dialogRef.close(this.comment);
      } else {
        this.hasServerError = true;
      }
    });
  }
}
