import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';


@Component({
  selector: 'app-process-upload',
  templateUrl: './process-upload.component.html',
  styleUrls: ['./process-upload.component.css']
})

export class ProcessUploadComponent {

  public files: any[] = [];

  constructor(public router: Router, protected route: ActivatedRoute,
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

  // setPage(route) {
  //   if (this.processDataService.activeProcess === undefined) {
  //     return;
  //   }
  //   if (this.processDataService.activeProcess.pageNumber >= 4 || this.processDataService.activeProcess.pageNumber === 2) {
  //     return;
  //   }
  //   switch (route) {
  //     case 'payment': {
  //         if ( this.processDataService.activeProcess.pageNumber === 1 && !this.processDataService.activeProcess.file) {
  //           this.router.navigate(['/platform', 'process', 'new', 'payment']);
  //           break;
  //         }
  //
  //
  //       this.router.navigate(['/platform', 'process', 'new', 'payment']);
  //       break;
  //     }
  //     case 'broadcast': {
  //       this.router.navigate(['/platform', 'process', 'new', 'broadcast']);
  //       break;
  //     }
  //     case 'new': {
  //       if (this.processDataService.activeProcess.pageNumber === 3) {
  //         return;
  //       }
  //         this.router.navigate(['/platform', 'process', 'new', 1]);
  //     }
  //   }
  // }

}


