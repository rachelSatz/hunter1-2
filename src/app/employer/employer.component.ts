import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Process } from 'app/shared/_models/process.model';
import { ProcessDataService } from 'app/shared/_services/process-data-service';

@Component({
  selector: 'app-employer',
  templateUrl: './employer.component.html',
  styleUrls: ['./employer.component.css']
})
export class EmployerComponent implements OnInit {

  constructor(public router: Router,
              private route: ActivatedRoute,
              private processDataService: ProcessDataService) { }
  // activeUrl: string;

  // readonly menuLinks = [
  //   { url: 'process-upload', label: 'טעינת קובץ'},
  //   { url: 'r', label: 'הורדת הנחיות לתשלום'},
  //
  // ];

  ngOnInit() {
    if ( this.processDataService.activeProcess === undefined) {
      this.processDataService.setProcess(new Process());
    }
    // this.router.events.forEach((event) => {
    //   if (event instanceof NavigationStart) {
    //     this.setActiveUrl(event.url);
    //   }
    // });
  }
  //
  // private setActiveUrl(url: string): void {
  //   this.activeUrl = url.split('/')[2];
  // }

  setHeaderColor(): number {
    if (this.router.url.indexOf('payment-instructions') !== -1) {
      return 2;
    } else if (this.router.url.indexOf('reference') !== -1)  {
      return 3;
    }  else if (this.router.url.indexOf('broadcast') !== -1)  {
      return 4;
    }  else if (this.router.url.indexOf('feedback') !== -1)  {
      return 5;
    } else if (this.router.url.indexOf('send-feed-employer') !== -1)  {
      return 6;
    }
    return 1;
  }


  setPage(num: number, type = false): void {
    // const status_process = this.processDataService.activeProcess.status_process;
    // if (status_process === undefined
    //   || status_process >= num || type
    //   || (status_process === 5 && num === 6)) {
    //   if (status_process === undefined || status_process < num ) {
        // this.processDataService.activeProcess.status_process = num;
        // this.processDataService.setProcess(this.processDataService.activeProcess);
        // this.selectUnit.setProcessData(this.processDataService);
      // }
      switch (num) {
        case 1:
          this.router.navigate(['/employer', 'process', 'new', 'update'], {relativeTo: this.route});
          break;
        case 2:
          this.router.navigate(['./payment-instructions'], {relativeTo: this.route});
          break;
        case 3:
          this.router.navigate(['./reference'], {relativeTo: this.route});
          break;
        case 4:
          this.router.navigate(['./broadcast'], {relativeTo: this.route});
          break;
        case 5:
          this.router.navigate(['./feedback'], {queryParams: {processId: 2300} , relativeTo: this.route});
          break;
        case 6:
          this.router.navigate(['./send-feed-employer'],
            {queryParams: {processId: 2300} , relativeTo: this.route});
          break;
      }
  }

}
