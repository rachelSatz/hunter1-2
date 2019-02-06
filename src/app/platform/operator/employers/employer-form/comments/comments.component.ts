import { Component, OnInit } from '@angular/core';
import {GeneralHttpService} from '../../../../../shared/_services/http/general-http.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  comments = [];
  comment: string;
  hasServerError: boolean;

  constructor(private generalService: GeneralHttpService) { }
  // employerId, contentType

  ngOnInit() {
    this.generalService.getComments(1, 'employer')
      .then(response => this.comments = response);
  }

}
