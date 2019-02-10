import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';

import { User } from 'app/shared/_models/user.model';
import {SelectUnitService} from '../../../../../shared/_services/select-unit.service';


@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        opacity: '0'
      })),
      state('active', style({
        display: 'block',
        opacity: '1'
      })),
      transition('active => inactive', animate('300ms ease-in')),
      transition('inactive => active', animate('300ms ease-in'))
    ])
  ]
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
    this.generalService.getComments(this.selectUnit.currentEmployerID, 'employer')
      .then(response => this.comments = response);
  }

  submit() {
    this.generalService.newComment(this.selectUnit.currentEmployerID, this.comment, 'employer').then();
    const curDate = new Date();
    console.log(this.comments[0].apdated_at);
    this.comments[this.comments.length] = {id: 1, content: this.comment, updated_at: curDate, created_at: curDate,
      username: this.user.username};
    this.comment = null;
  }

}
