import { Component, OnInit } from '@angular/core';
import {EmployerService} from '../../../../../shared/_services/http/employer.service';
import {SelectUnitService} from '../../../../../shared/_services/select-unit.service';

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

  constructor( private employerService: EmployerService, private selectUnit: SelectUnitService) { }

  ngOnInit() {
    for (let i = 0; i < 31; i++) {
      this.month[i] = i + 1;
    }
    this.employerService.monthlyReports(this.selectUnit.currentEmployerID);
  }

  submit(form) {
    this.employerService.updateMonthlyReports(form.value, this.selectUnit.currentEmployerID);
  }
}
