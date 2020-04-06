import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {SelectUnitService} from 'app/shared/_services/select-unit.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';


@Component({
  selector: 'app-process-upload',
  templateUrl: './process-upload.component.html',
  styleUrls: ['./process-upload.component.css']
})

export class ProcessUploadComponent {

  public files: any[] = [];

  constructor(public router: Router,
              protected route: ActivatedRoute,
              private processDataService: ProcessDataService,
              private  selectUnitService: SelectUnitService) {}


  setHeaderColor(): number {
    const currentRoute = (this.router.url).split('/');
    if (currentRoute[5]) {
      if (currentRoute[5] === 'payment') {
        return 2;
      }
      if (currentRoute[5].split('?')[0] === 'broadcast') {
        return 3;
    }
    if (currentRoute[5]) {
        if (currentRoute[5].split('?')[0] === 'details') {
          if (this.processDataService.activeProcess === undefined) {
            this.processDataService = this.selectUnitService.getProcessData();
          }
          if (this.processDataService.activeProcess.pageNumber >= 4) {
            return 3;
          }
        }
        return 2;
      }
    }
  }
}


