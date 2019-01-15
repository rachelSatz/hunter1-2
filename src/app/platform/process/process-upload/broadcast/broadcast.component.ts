import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material';
import { DateUpdateComponent } from './date-update/date-update.component';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ProcessDetails } from 'app/shared/_models/process-details.model';
import { ActivatedRoute } from '@angular/router';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { Process } from 'app/shared/_models/process.model';


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
  page;


  constructor(private dialog: MatDialog, private route: ActivatedRoute,
              private processService: ProcessService,
              private  processDataService: ProcessDataService) {}

  ngOnInit() {

    this.type = this.processDataService.activeProcess.type;
    this.processId = this.processDataService.activeProcess.processID;
    if ( this.type === 'positive' ) {
      this.isRefund = false;
    } else {
      this.isRefund = true;
    }
    this.processDataService.activeProcess.pageNumber = 3;
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
    this.pageNumber = 1;
    this.isRefund = true;
  }
}
