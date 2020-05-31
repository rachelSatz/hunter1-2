import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ProcessDetails } from 'app/shared/_models/process-details.model';
import { DocumentArchiveComponent } from './document-archive/document-archive.component';
import { MatDialog } from '@angular/material';
import { Process } from 'app/shared/_models/process.model';

@Component({
  selector: 'app-process-loading',
  templateUrl: './process-loading.component.html',
  styleUrls: ['./process-loading.component.css']
})
export class ProcessLoadingComponent implements OnInit , OnDestroy {

  @Output() process_details: ProcessDetails;

  constructor(public router: Router,
              protected route: ActivatedRoute,
              private dialog: MatDialog,
              private processDataService: ProcessDataService,
              public selectUnit: SelectUnitService,
              private processService: ProcessService) { }

  ngOnInit() {
    // console.log(this.route.snapshot.params.status);
    // if (this.route.snapshot.params.status === 'create') {
    //   this.process_details = undefined;
    //   this.processDataService.activeProcess = undefined;
    // }

    if (this.processDataService.activeProcess === undefined) {
      this.processDataService = this.selectUnit.getProcessData();
    }
    // this.processDataService.activeProcess.status_process = 1;
    const processDataService = this.processDataService.activeProcess;
    if (processDataService !== undefined  && processDataService.processID) {
      this.processService.getUploadFileDone(processDataService.processID).then(response =>
        this.process_details = response
      );
    }
  }

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
    if (status_process === undefined
      || status_process >= num || type
      || (status_process === 5 && num === 6)) {
      if (status_process === undefined || status_process < num ) {
        this.processDataService.activeProcess.status_process = num;
        this.processDataService.setProcess(this.processDataService.activeProcess);
      }
      switch (num) {
        case 1:
          this.router.navigate(['/platform', 'process', 'new', 'update'], {relativeTo: this.route});
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
          this.router.navigate(['./feedback'], {queryParams: {processId: this.process_details.id} , relativeTo: this.route});
          break;
        case 6:
          this.router.navigate(['./send-feed-employer'],
            {queryParams: {processId: this.process_details.id} , relativeTo: this.route});
          break;
      }
    }
  }

  showRows(): void {
    this.router.navigate(['/platform', 'process', 'new', 'update', 'payment-instructions', 'records'], {queryParams: {show: true}});
  }

  showFiles(): void {
    this.router.navigate(['/platform', 'process', 'new', 'update', 'payment-instructions'], {queryParams : {show: true}});
  }

  openArchiveDocument(): void {
    this.dialog.open(DocumentArchiveComponent, {
      data: {processId: this.process_details.id},
      width: '630.6px',
      height: '450px',
      panelClass: 'document-dialog'
    });
  }

  ngOnDestroy() {
    if ( this.processDataService.activeProcess !== undefined && this.router.url.indexOf('process/edit-payments') === -1) {
      this.processDataService.setProcess(new Process());
    }
    this.process_details = null;
  }
}
