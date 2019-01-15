import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  providers: [NotificationService]
})
export class DetailsComponent implements OnInit {

type = 'records' || 'files';

  constructor( private router: Router, private processDataService: ProcessDataService) { }

  ngOnInit() {
   if (this.router.url.split('?')[1]) {
     this.type = 'files';
   } else {
     this.type = 'records';
   }
  }

  back() {
    if (this.processDataService.activeProcess.pageNumber === 4 || this.processDataService.activeProcess.pageNumber === 5) {
      this.router.navigate(['/platform', 'process', 'new', 'broadcast']);
    } else {
      this.router.navigate(['/platform', 'process', 'new', 'payment']);
    }
  }
}
