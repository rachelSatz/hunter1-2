import { Component, OnInit } from '@angular/core';

import { EmployerService } from 'app/shared/_services/http/employer.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employer } from 'app/shared/_models/employer.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  month = [];
  sendFileFeedback = false;
  sendRecordFeedback = false;
  feedbacksDay = 15;
  transmissionDay = 15;
  type = 'report';
  role = this.userSession.getRole() !== 'employer';
  employer: Employer;


  constructor( private route: ActivatedRoute,
               private employerService: EmployerService,
               private selectUnit: SelectUnitService,
               private userSession: UserSessionService,
               protected notificationService: NotificationService) { }

  ngOnInit() {
    for (let i = 0; i < 31; i++) {
      this.month[i] = i + 1;
    }
    this.employer = this.route.parent.snapshot.parent.data['employer'];
    this.sendFileFeedback = this.employer['file_feedback'];
    this.sendRecordFeedback =  this.employer['record_feedback'];
    this.feedbacksDay =  this.employer['feedback_day'];
    this.transmissionDay =  this.employer['transmission_day'];
  }

  submit(form) {
    this.employerService.updateMonthlyReports(form.value, this.selectUnit.currentEmployerID).then( response => {
      if ( response === 'Success') {
        this.employer['file_feedback'] = this.sendFileFeedback;
        this.employer['record_feedback'] = this.sendRecordFeedback;
        this.employer['feedback_day'] = this.feedbacksDay ;
        this.employer['transmission_day'] = this.transmissionDay;
        this.notificationService.success('נשמר בהצלחה');
      }else {
        this.notificationService.success( 'שגיאה');
      }
    });
  }
}
