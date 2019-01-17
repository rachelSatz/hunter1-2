import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import {ProcessDetails} from '../../../../../shared/_models/process-details.model';
import {ProcessService} from '../../../../../shared/_services/http/process.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  providers: [NotificationService]
})
export class DetailsComponent implements OnInit {

  type = 'records' || 'files';
  process_details: ProcessDetails;

  constructor( private router: Router,
               private processDataService: ProcessDataService,
               private processService: ProcessService) { }

  ngOnInit() {
   if (this.router.url.split('?')[1]) {
     this.type = 'files';
   } else {
     this.type = 'records';
   }
    this.processService.getUploadFileDone(this.processDataService.activeProcess.processID).then( response =>
      this.process_details = response
    );
  }

  back() {
    if (this.processDataService.activeProcess.pageNumber === 4 || this.processDataService.activeProcess.pageNumber === 5) {
      this.router.navigate(['/platform', 'process', 'new', 1, 'broadcast']);
    } else {
      this.router.navigate(['/platform', 'process', 'new', 1 , 'payment', this.processDataService.activeProcess.processID]);
    }
  }
}
