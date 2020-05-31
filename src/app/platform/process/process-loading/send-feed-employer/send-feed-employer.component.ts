import { Component, OnInit } from '@angular/core';

import { fade } from 'app/shared/_animations/animation';
import { ProcessLoadingComponent } from 'app/platform/process/process-loading/process-loading.component';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';

@Component({
  selector: 'app-send-feed-employer',
  templateUrl: './send-feed-employer.component.html',
  styleUrls: ['./send-feed-employer.component.css', './../../process-loading/process-loading.component.css'],
  animations: [ fade ]
})
export class SendFeedEmployerComponent implements OnInit {

  hasShow: boolean;
  count_employee: number;
  fix: number;
  failed: number;


  constructor(public processLoading: ProcessLoadingComponent,
              private feedbackService: FeedbackService,
              public processDataService: ProcessDataService,
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
