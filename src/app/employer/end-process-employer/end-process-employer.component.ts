import { Component, OnInit } from '@angular/core';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import { EmployerComponent } from 'app/employer/employer.component';

@Component({
  selector: 'app-end-process-employer',
  templateUrl: './end-process-employer.component.html',
  styleUrls: ['./end-process-employer.component.css']
})
export class EndProcessEmployerComponent implements OnInit {

  hasShow: boolean;
  count_employee: number;
  fix: number;
  failed: number;

  constructor(public processDataService: ProcessDataService,
              public employerComponent: EmployerComponent,
              private feedbackService: FeedbackService,
              private selectUnit: SelectUnitService) { }

  ngOnInit() {
    if (this.processDataService.activeProcess === undefined) {
      this.processDataService = this.selectUnit.getProcessData();
    }
    this.feedbackService.getDetailsFeedBack(this.processDataService.activeProcess.processID).then( response => {
      this.count_employee = response['count_employee'];
      this.fix = response['fix'];
      this.failed = response['failed'];
    });
  }

}
