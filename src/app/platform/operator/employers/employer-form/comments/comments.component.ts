import { Component, OnInit } from '@angular/core';

import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { User } from 'app/shared/_models/user.model';
import { fade } from 'app/shared/_animations/animation';


@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
  animations: [ fade ]
})
export class CommentsComponent implements OnInit {
  user: User;
  comments = [];
  comment: string;
  hasServerError: boolean;

  constructor(private generalService: GeneralHttpService, private userSession: UserSessionService,
              private selectUnit: SelectUnitService) { }

  ngOnInit() {
    this.user = this.userSession.getUser();
    this.generalService.getComments([this.selectUnit.currentEmployerID], 'employer')
      .then(response => this.comments = response);
  }

  submit() {
    if (this.comment === undefined) {
      return;
    }

    this.generalService.newComment([this.selectUnit.currentEmployerID], this.comment, 'employer')
      .then(response => {
        if (!response) {
           this.hasServerError = true;
           return;
      }} );

    const curDate = new Date();
    this.hasServerError = false;
    this.comments[this.comments.length] = {id: 1, content: this.comment, updated_at: curDate, created_at: curDate,
                  username: this.user.username};
    this.comment = undefined;
  }

}
