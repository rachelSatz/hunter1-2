import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Process } from 'app/shared/_models/process.model';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { ProcessDetails } from 'app/shared/_models/process-details.model';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { OrganizationService } from 'app/shared/_services/http/organization.service';

@Component({
  selector: 'app-employer',
  templateUrl: './employer.component.html',
  styleUrls: ['./employer.component.css'],
})
export class EmployerComponent implements OnInit {

  constructor(public router: Router,
              private route: ActivatedRoute,
              public helpers: HelpersService,
              private organizationService: OrganizationService,
              private selectUnit: SelectUnitService,
              public processDataService: ProcessDataService) { }
  // activeUrl: string;
  @Output() process_details: ProcessDetails;
  // @Output() organizations: any;
  @Output() isDepartmentLink = false;

    // readonly menuLinks = [
  //   { url: 'process-upload', label: 'טעינת קובץ'},
  //   { url: 'r', label: 'הורדת הנחיות לתשלום'},
  //
  // ];

  ngOnInit() {
    this.selectUnit.changeOrganizationEmployerDepartment(1 , 2, 2);

    if ( this.processDataService.activeProcess === undefined) {
      this.processDataService.setProcess(new Process());
    }
  }


  // getOrganizations(): void {
  //   this.helpers.setPageSpinner(true);
  //   this.organizationService.getOrganizations().then(response => {
  //     this.selectUnit.setOrganization(response);
  //     this.organizations = response;
  //     this.helpers.setPageSpinner(false);
  //   });
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
    const status_process = this.processDataService.activeProcess.status_process;
    if (status_process === undefined || status_process >= num ) {
      //   || (status_process === 5 && num === 6)) {
      //   if (status_process === undefined || status_process < num ) {
      // this.processDataService.activeProcess.status_process = num;
      // this.processDataService.setProcess(this.processDataService.activeProcess);
      // this.selectUnit.setProcessData(this.processDataService);
      // }
      switch (num) {
        case 1:
          this.router.navigate(['./process-upload-employer.component'], {relativeTo: this.route});
          break;
        case 2:
          this.router.navigate(['./payment-instructions-employer'], {relativeTo: this.route});
          break;
        case 3:
          this.router.navigate(['./reference-employer'], {relativeTo: this.route});
          break;
        case 4:
          this.router.navigate(['./broadcast-employer'], {relativeTo: this.route});
          break;
        case 5:
          this.router.navigate(['./feedback-employer'],
            {
              queryParams: {processId: this.processDataService.activeProcess.processID}
              , relativeTo: this.route
            });
          break;
        case 6:
          this.router.navigate(['./send-employer-feed'],
            {queryParams: {processId: 2300}, relativeTo: this.route});
          break;
      }
    }
  }

  openRow(): void {
    this.router.navigate([ './files'], {relativeTo: this.route});
  }
}
