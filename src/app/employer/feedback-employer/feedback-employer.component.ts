import { Component, OnInit } from '@angular/core';
import { MONTHS } from 'app/shared/_const/months';
import { EmployerComponent } from 'app/employer/employer.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';

@Component({
  selector: 'app-feedback-employer',
  templateUrl: './feedback-employer.component.html',
  styleUrls: ['./feedback-employer.component.css']
})
export class FeedbackEmployerComponent implements OnInit {

  constructor( public employerComponent: EmployerComponent,
               protected notificationService: NotificationService,
               private processService: ProcessService,
               public processDataService: ProcessDataService,
               private selectUnit: SelectUnitService) { }

  months = MONTHS;

  ngOnInit() {
    if (this.processDataService.activeProcess === undefined) {
      this.processDataService = this.selectUnit.getProcessData();
    }
  }

}
