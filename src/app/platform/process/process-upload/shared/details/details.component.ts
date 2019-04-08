import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { ProcessDetails } from 'app/shared/_models/process-details.model';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import {SelectUnitService} from '../../../../../shared/_services/select-unit.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  providers: [NotificationService],
  styles: [ '.disabled { pointer-events: none; opacity: 0.4; }' ]
})
export class DetailsComponent extends DataTableComponent implements OnInit {

  type = 'records' || 'files';
  process_details: ProcessDetails;

  constructor(route: ActivatedRoute,
              private router: Router,
              public processDataService: ProcessDataService,
              private processService: ProcessService,
              private selectUnitService: SelectUnitService) {
    super(route);
  }

  ngOnInit() {
    if (this.processDataService.activeProcess === undefined) {
      this.processDataService = this.selectUnitService.getProcessData();
    }
    this.processService.getUploadFileDone(this.processDataService.activeProcess.processID).then( response =>
      this.process_details = response
    );
   if (this.router.url.split('?')[1]) {
     this.type = 'files';
   } else {
     this.type = 'records';
   }
  }

  back() {
    if (this.processDataService.activeProcess.pageNumber === 4 || this.processDataService.activeProcess.pageNumber === 5) {
      this.router.navigate(['/platform', 'process', 'new', 1, 'broadcast']);
    } else {
      this.router.navigate(['/platform', 'process', 'new', 1 , 'payment', this.processDataService.activeProcess.processID]);
    }
  }
}
