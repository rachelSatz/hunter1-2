import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {ProcessService} from 'app/shared/_services/http/process.service';
import {ProcessDataService} from 'app/shared/_services/process-data-service';
import {NotificationService} from 'app/shared/_services/notification.service';

import {Process} from 'app/shared/_models/process.model';
import {ProcessDetails} from 'app/shared/_models/process-details.model';

import {DateUpdateComponent} from './date-update/date-update.component';


@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.css'],
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        opacity: '0'
      })),
      state('active', style({
        display: 'block',
        opacity: '1'
      })),
      transition('active => inactive', animate('0ms ease-in')),
      transition('inactive => active', animate('300ms ease-in'))
    ])
  ],
  providers: [ProcessService, NotificationService]
})
export class BroadcastComponent implements OnInit {

  process: Process;
  file: boolean;
  record: boolean;
  type;
  data;
  processId;
  pageNumber = 1;
  valid: boolean;
  isRefund: boolean;
  employer;
  department;
  processID = 1;
  process_details: ProcessDetails;
  paymentDate: string;


  constructor(private dialog: MatDialog, private route: ActivatedRoute,
              private router: Router,
              private processService: ProcessService,
              private  processDataService: ProcessDataService,
              private notificationService: NotificationService) {}

  ngOnInit() {
    this.type = this.processDataService.activeProcess.type;
    this.processId = this.processDataService.activeProcess.processID;
    this.isRefund = this.type !== 'positive';
    if (this.processDataService.activeProcess.pageNumber !== 5) {
      this.processDataService.activeProcess.pageNumber = 4;
    } else {
      this.pageNumber = 2;
    }
  }

  dateUpdate() {
    const dialogRef = this.dialog.open(DateUpdateComponent, {
      height: '230px',
      width: '550px',
    });
    dialogRef.afterClosed().subscribe(
      data => this.paymentDate = data
    );
  }

  getData() {
    this.processService.getUploadFile(this.processID)
      .then(response => {
        this.process_details = response;
        switch (this.process_details.status) {
          case 'Loading': {
            break;
          }
          case 'Error_Loading': {
            break;
          }
        }
      });
  }

  Refund() {
    this.processDataService.activeProcess = new Process();
    this.processDataService.activeProcess.type = 'negative';
    console.log(this.processDataService.activeProcess);
    this.router.navigate(['/platform', 'process', 'new', 0]);

  }


  transfer() {
    this.processService.transfer( this.processID)
      .then(response => {
        if (response['result'] === 'false') {
          this.notificationService.error('', 'לא הצליח לשדר קובץ');
        }else {
          this.pageNumber = 2;
        }
      });
  }

  setPage(type) {
    console.log(this.processDataService.activeProcess.pageNumber);
    if (type === 'detailed-files') {
     const files = {name: 'files'};
     this.router.navigate(['/platform', 'process', 'new', 1, 'details'], {queryParams: files});
   } else {
     this.router.navigate(['/platform', 'process', 'new', 1, 'details']);
   }

  }

}
