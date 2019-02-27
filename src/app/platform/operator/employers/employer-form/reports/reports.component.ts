import { Component, OnInit } from '@angular/core';
import {EmployerService} from '../../../../../shared/_services/http/employer.service';
import {SelectUnitService} from '../../../../../shared/_services/select-unit.service';
import {NotificationService} from '../../../../../shared/_services/notification.service';

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

  constructor( private employerService: EmployerService,
               private selectUnit: SelectUnitService,
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
