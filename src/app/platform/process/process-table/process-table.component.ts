import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';

import { ProcessService } from 'app/shared/_services/http/process.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { NotificationService } from 'app/shared/_services/notification.service';

import { Subscription } from 'rxjs';
import * as FileSaver from 'file-saver';
import { Process, ProcessStatus, ProcessType } from 'app/shared/_models/process.model';
import { MONTHS } from 'app/shared/_const/months';

@Component({
  selector: 'app-process-table',
  templateUrl: './process-table.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', './process-table.component.css']
})
export class ProcessTableComponent extends DataTableComponent implements OnInit, OnDestroy {

  processStatus = ProcessStatus;
  processType = ProcessType;
  year = (new Date()).getFullYear();
  years = [ this.year, (this.year - 1) , (this.year - 2), (this.year - 3)];
  months = MONTHS;
  sub = new Subscription;


  readonly headers: DataTableHeader[] =  [
    { column: 'process_name', label: 'שם תהליך' }, { column: 'process_number', label: 'מספר תהליך' },
    { column: 'type', label: 'סוג תהליך' },
    { column: 'employer_name', label: 'שם מעסיק' }, { column: 'employer_name', label: 'שם מחלקה' },
    { column: 'month', label: 'חודש' }, {column: 'year', label: 'שנה' },
    { column: 'amount', label: 'סכום' }, { column: 'status', label: 'סטטוס ' }
    , { column: 'download', label: 'הורדה' }
  ];

  constructor(route: ActivatedRoute, private router: Router,
              private processService: ProcessService,
              private selectUnit: SelectUnitService,
              protected notificationService: NotificationService,
              public processDataService: ProcessDataService) {
    super(route, notificationService);
    this.searchCriteria['year'] = this.year;
  }

  ngOnInit() {
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => this.fetchItems()));

    super.ngOnInit();
  }

  fetchItems(): void {
    const organizationId = this.selectUnit.currentOrganizationID;
    const employerId = this.selectUnit.currentEmployerID;
    const departmentId = this.selectUnit.currentDepartmentID;

    if (organizationId) {
      this.searchCriteria['departmentId'] = departmentId;
      this.searchCriteria['employerId'] = employerId;
      this.searchCriteria['organizationId'] = organizationId;
      this.processService.getProcesses(this.searchCriteria).then(response => this.setItems(response));
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.sub.unsubscribe();
  }

  redirectProcessNew(): void {
    this.router.navigate(['platform', 'process' , 'new', '0']);
  }

  downloadFileProcess(processId: number): void {
    this.processService.downloadFileProcess(processId).then(response => {
      if (response.ok) {
        const byteCharacters = atob(response['blob']);
        const byteNumbers = new Array(byteCharacters.length);
        console.log(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: 'application/dat'});
        const fileURL = URL.createObjectURL(blob);
          FileSaver.saveAs(blob, response['fileName']);
      }else {
        this.notificationService.error('', ' אין אפשרות להוריד את הקובץ ');
      }
    });
  }

  moveProcess(process: Process): void {
    const status = this.processStatus[process.status];
   if (status === this.processStatus.Loading || status ===  this.processStatus.Can_Be_Processed
   || status === this.processStatus.Done_Processing) {
     const date = new Date(process.date);
     const data = {
       'pageNumber': 1,
       'processName': process.name,
       'year': date.getFullYear(),
       'month': date.getMonth(),
       'monthName':  this.months[date.getMonth()],
       'processId': process.id
     };

     this.processDataService.setProcess(data);

     this.router.navigate(['platform', 'process' , 'new', '0', 'payment', process.id]);
   }
  }

  messageError(error: string): void {
    this.notificationService.error('', error);
  }

}
