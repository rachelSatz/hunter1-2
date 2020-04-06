import { ActivatedRoute, Router } from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {Subscription} from 'rxjs';
import { PlatformComponent } from 'app/platform/platform.component';



@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.css'],
  animations: [ fade ],
  providers: [ProcessService, NotificationService]
})
export class BroadcastComponent implements OnInit, OnDestroy {

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
  permissionsType = this.userSession.getPermissionsType('operations');
  organizationId: number;
  subscription = new Subscription;


  constructor(private dialog: MatDialog, private route: ActivatedRoute,
              private router: Router,
              private processService: ProcessService,
              public  processDataService: ProcessDataService,
              private notificationService: NotificationService,
              public userSession: UserSessionService,
              private selectUnitService: SelectUnitService,
              private platformComponent: PlatformComponent,
              private selectUnit: SelectUnitService,
              private _location: Location) {}

  ngOnInit() {
    this.organizationId = this.selectUnitService.currentOrganizationID;

    if (this.processDataService.activeProcess !== undefined) {
      this.selectUnitService.setProcessData(this.processDataService);
    } else {
      this.processDataService = this.selectUnitService.getProcessData();
    }
    this.subscription.add(this.selectUnitService.unitSubject.subscribe(() => this.fetchItems()));
    this.type = this.processDataService.activeProcess.type;
    this.processId = this.processDataService.activeProcess.processID;
    this.isRefund = this.type !== 'positive';
    if (this.processDataService.activeProcess.pageNumber !== 5) {
      this.processDataService.activeProcess.pageNumber = 4;
    } else {
      this.pageNumber = 2;
    }
    this.process_details = new ProcessDetails;
    this.processService.getUploadFile(this.processDataService.activeProcess.processID).subscribe(response => {
      this.process_details = response;
    });

  }

  fetchItems() {
    if (+this.organizationId !== +this.selectUnitService.currentOrganizationID) {
      this.router.navigate(['/platform', 'process', 'table']);
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
    this.processService.getCommentBroadcast(this.processDataService.activeProcess.employer_id).then(comment => {
      const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};
      if (comment === null) {comment = ''; }
      this.notificationService.warning('אשר שידור', comment , buttons).then(confirmation => {
        if (confirmation.value) {
          this.processService.transfer(this.processId, 'processId')
            .then(response => {
              if (response.ok === false) {
                this.notificationService.error('', 'לא הצליח לשדר קובץ');
              } else {
                this.pageNumber = 2;
              }
            });
        }
      });
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  submitFeedBack() {
    const processData = this.processDataService.activeProcess;
    this.platformComponent.employerId = this.process_details.employer_id;
    this.platformComponent.departmentId = this.process_details.dep_id;

    this.selectUnit.changeOrganizationEmployerDepartment(
      this.platformComponent.organizationId,
      this.platformComponent.employerId,
      this.platformComponent.departmentId);

    this.router.navigate(['/platform', 'feedback', 'files'],
      {queryParams: {processId: processData.processID,
          year: processData.year, month: processData.month, processName: processData.name}});
  }
}
