import { Component, OnInit } from '@angular/core';

import { EmployerService } from 'app/shared/_services/http/employer.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';

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
  role = this.userSession.getRole() !== 'employer';


  constructor( private employerService: EmployerService,
               private selectUnit: SelectUnitService,
               private userSession: UserSessionService,
               protected notificationService: NotificationService) { }

  ngOnInit() {
    for (let i = 0; i < 31; i++) {
      this.month[i] = i + 1;
    }
    this.employerService.monthlyReports(this.selectUnit.currentEmployerID).then( response => {
      this.sendFileFeedback = response['file_feedback'];
      this.sendRecordFeedback =  response['record_feedback'];
      this.feedbacksDay =  response['feedbacks_day'];
      this.transmissionDay =  response['transmission_day'];
    });
  }

  submit(form) {
    this.employerService.updateMonthlyReports(form.value, this.selectUnit.currentEmployerID).then( response => {
      if ( response === 'Success') {
        this.notificationService.success('נשמר בהצלחה');
      }else {
        this.notificationService.success( 'שגיאה');
      }
    });
  }
}
