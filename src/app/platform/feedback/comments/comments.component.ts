import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSessionService } from 'app/shared/_services/user-session.service';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  constructor(public mtbService: MonthlyTransferBlockService,
              private router: Router,
              public datePipe: DatePipe,
              public route: ActivatedRoute,
              private userSession: UserSessionService,
              private generalService: GeneralHttpService) { }
  comment: string;
  comments: any;
  employee_id: number;
  user: any;

  ngOnInit() {
    this.user = this.userSession.getUser();
    this.employee_id = +this.router.url.split('/')[4].split(';')[0];
    this.mtbService.getAllCommentsByIdEmployee(this.employee_id ).then( r =>  this.comments = r);
  }

  submit() {
    if (this.comment === undefined) {
      return;
    }

    this.generalService.newComment([this.employee_id], this.comment, 'employee')
      .then(response => {
        if (!response) {
          // this.hasServerError = true;
          return;
        }} );

    const curDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy HH:MM:SS');
    // this.hasServerError = false;
    this.comments[this.comments.length] = {id: 1, content: this.comment, date: curDate,
      name: this.user.username, company_name: '', process_name: ''};
    this.comment = undefined;
  }

}
