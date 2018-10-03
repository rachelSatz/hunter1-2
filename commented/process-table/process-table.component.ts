import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';



import { ProcessService } from '../../shared/_services/http/process.service';
import { ProcessFileService } from '../../shared/_services/http/process-file.service';
import { EmployerService } from '../../shared/_services/http/employer.service';
import { NotificationService, NotificationType } from '../../shared/_services/notification.service';

import { Employer } from '../../shared/_models/employer.model';
import { Process, ValidityStatus, StepStatus } from '../../shared/_models/process.model';

import { MONTHS } from '../../shared/_const/months';

import * as FileSaver from 'file-saver';
import { DataTableComponent } from "../../shared/data-table/data-table.component";

import { MatDialog } from "@angular/material";
import { ApplicationCommentComponent } from "../feedback/application-comment/application-comment.component";

declare let swal: any;

@Component({
  selector: 'app-process-table',
  templateUrl: './process-table.component.html',
  styleUrls: ['../../shared/data-table/data-table.component.css', './process-table.component.css']
})
export class ProcessTableComponent extends DataTableComponent implements OnInit {

  readonly months = MONTHS;
  readonly currentYear = new Date().getFullYear();

  // employers: Employer[];
  process = new Process;
  GetnotSend: Boolean = false;
  validityStatus = ValidityStatus;
  stepStatus = StepStatus;

  readonly headers = [
    { column: 'addToProcessName', label: 'שם תהליך' }, { column: 'id', label: 'מספר תהליך' }, { column: 'employerName', label: 'שם מעסיק' },
    { column: 'month', label: 'חודש' }, { column: 'year', label: 'שנה' },
    { column: 'codeFile', label: 'קוד' }, { column: 'totalPaymentFile', label: 'סכום' },
    { column: 'statusTransmit', label: 'סטטוס שידור' },
  ];

  searchCriteria: { employerID: number, year: number, months: number[], newProcess: boolean, NotSent: boolean };

  constructor(protected route: ActivatedRoute, private processService: ProcessService,
    private processFileService: ProcessFileService,
    private employerService: EmployerService, private router: Router,
    private notificationService: NotificationService, private dialog: MatDialog, ) {
    super(route);
  }

  ngOnInit() {



    this.searchCriteria.employerID = +sessionStorage.getItem('EmployerID');
    // this.employerService.getEmployers().then(response => this.init(response));
    this.searchCriteria.year = (new Date().getMonth() === 0) ? new Date().getFullYear() - 1 : new Date().getFullYear();
    this.searchCriteria.NotSent = false;
    this.searchCriteria.newProcess = false;
    const notSend = this.route.snapshot.queryParams['notSend'];
    if (notSend) {
      this.searchCriteria.NotSent = notSend;
    }
    const newProcess = this.route.snapshot.queryParams['newProcess'];
    if (newProcess) {
      this.searchCriteria.newProcess = newProcess;
    }
    if (this.searchCriteria.newProcess || this.searchCriteria.NotSent) {
      this.searchCriteria.employerID = 0;
      sessionStorage.setItem('EmployerID', this.searchCriteria.employerID.toString());
    }
    super.ngOnInit();

  }
  openCommentDialog(process: Process): void {
    const dialog = this.dialog.open(ApplicationCommentComponent, {
      data: {
        Comments: process.errorMessage,
        IsDisabled:true
      }
    });
  }

  /*
    private init(response: Employer[]): void {
     /* this.employers = response;
      this.searchCriteria.employerID = this.employers[0].id;*/
  /*this.searchCriteria.year = (new Date().getMonth() === 0) ? new Date().getFullYear() -  1 : new Date().getFullYear();
  this.fetchItems();
}*/
  setEmployer(employer: Employer) {
    if (employer == null) {
      this.searchCriteria.employerID = 0;
    }
    else {
      this.searchCriteria.employerID = employer.id;
    }


    this.fetchItems();

  }
  RemovePage() {
    let index = this.router.url.indexOf("?");
    if (index > -1) {
      let url: string = this.router.url.substring(0, index);
      this.router.navigateByUrl(url);
    }
  }
  selectAllMonths() {
    this.searchCriteria.months = [];

    for (let i = 1; i < 13; i++) {
      this.searchCriteria.months.push(i);
    }


    this.fetchItems();
  }

  fetchItems(): void {
    this.RemovePage();

    this.processService.getProcesses(this.searchCriteria, this.orderCriteria).then(
      response => this.setItems(response)
    );
    this.GetnotSend = false;
  }

  downloadFile(processID: number): void {
    this.processFileService.downloadProcessFile(processID).then(response => {
      console.log("response-downloadFile", response);
      this.saveToFileSystem(response);
    }
    )
      .catch(() =>
        this.notificationService.showResult('הקובץ אינו קיים במערכת', NotificationType.error)
      );
  }
  saveToFileSystem(response: any) {

    const contentDispositionHeader: string = response['headers'].get('Content-Disposition');
    const parts: string[] = contentDispositionHeader.split(';');
    const filename = parts[1].split('=')[1];
    const blob = new Blob([response.body], { type: response.type });
    FileSaver.saveAs(blob, filename);
  }
  openProcessStatusErrorMessageComponent(): void {
    swal({
      title: '',
      text: 'שגיאה בטעינת הנתונים',
      type: 'warning',
      confirmButtonText: 'המשך'
    });
  }
  openProcessStatusLodeMessageComponent(): void {
    swal({
      title: '',
      text: 'התהליך בטעינה ',
      type: 'warning',
      confirmButtonText: 'המשך'
    });
  }
  handleProcessClick(process: Process): void {
    console.log("process.stepStatus", process.stepStatus);
    console.log("process.pay", process.pay);

    switch (process.stepStatus) {

      case 3:
        this.openProcessStatusLodeMessageComponent();
        break;
      case -1:
        this.openProcessStatusErrorMessageComponent();
        break;
      case 1:
        this.router.navigate(['/process', 'new', process.id]);
        break;
      case 2:
        const url = (process.pay || process.HaveDatevalue || process.NegativeProcess) ? 'transmission' : 'payment';
        this.router.navigate(['/process', 'new', process.id, url]);
        break;
      default:
      sessionStorage.setItem('EmployerID', process.employer.id.toString());
        this.router.navigate(['/feedback', 'table', 'files'],
          <NavigationExtras>{ queryParams: { month: process.month, year: process.year, processId: process.id, employerId: process.employer.id } });
    }
  }

}
