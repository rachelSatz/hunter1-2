import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material';
import {DateUpdateComponent} from './date-update/date-update.component';
import { ProcessService } from 'app/shared/_services/http/process.service';
import {ProcessDetails} from '../../../../shared/_models/process-details.model';



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
  providers: [ProcessService]
})
export class BroadcastComponent implements OnInit {

  pageNumber = 1;
  valid: boolean;
  processID = 1;
  process_details: ProcessDetails;
  paymentDate: string;


  constructor(private dialog: MatDialog, private processService: ProcessService) {}

  ngOnInit() {

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

}
