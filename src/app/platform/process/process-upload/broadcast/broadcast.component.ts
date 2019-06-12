import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common';

import { ProcessService } from 'app/shared/_services/http/process.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { NotificationService } from 'app/shared/_services/notification.service';

import { fade } from 'app/shared/_animations/animation';
import { Process } from 'app/shared/_models/process.model';
import { ProcessDetails } from 'app/shared/_models/process-details.model';
import { DateUpdateComponent } from './date-update/date-update.component';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';



@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.css'],
  animations: [ fade ],
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
  process_details: ProcessDetails;
  paymentDate = '--/--/--';

  constructor(private dialog: MatDialog, private route: ActivatedRoute,
              private router: Router,
              private processService: ProcessService,
              public  processDataService: ProcessDataService,
              private notificationService: NotificationService,
              public userSession: UserSessionService,
              private selectUnitService: SelectUnitService,
              private _location: Location) {}

  ngOnInit() {
    if (this.processDataService.activeProcess === undefined) {
      this.processDataService = this.selectUnitService.getProcessData();
    }
    this.processService.getUploadFile(this.processDataService.activeProcess.processID).subscribe(response => {
      this.process_details = response;
    });

    this.process_details = new ProcessDetails;
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
      data:  {processID: this.processDataService.activeProcess.processID},
      height: '250px',
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(
      data => this.paymentDate = data
    );
  }

  Refund() {
    this.processDataService.activeProcess = new Process();
    this.processDataService.activeProcess.type = 'negative';
    this.router.navigate(['/platform', 'process', 'new', 2]);
  }

  transfer() {
    this.processService.transfer( this.processId, 'processId')
      .then(response => {
        if (response.ok === false) {
          this.notificationService.error('', 'לא הצליח לשדר קובץ');
        }else {
          this.pageNumber = 2;
        }
      });
  }

  setPage(type) {
    if (type === 'detailed-files') {
     const files = {name: 'files'};
     this.router.navigate(['/platform', 'process', 'new', 1, 'details', 'files']);
   } else {
     this.router.navigate(['/platform', 'process', 'new', 1, 'details', 'records']);
   }
  }

  previous(): void {
    this.processDataService.activeProcess.pageNumber = 3;
    this._location.back();
    // this.router.navigate(['/platform', 'process', 'new', 1 , 'payment',
    //     this.processDataService.activeProcess.processID],
    //   { relativeTo: this.route });
  }
}
