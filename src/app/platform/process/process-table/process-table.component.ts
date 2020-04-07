import { Component, OnDestroy, OnInit, ViewChild, ViewRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';

import { MONTHS } from 'app/shared/_const/months';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { Process, ProcessStatus, ProcessType } from 'app/shared/_models/process.model';
import { PlatformComponent } from '../../platform.component';

@Component({
  selector: 'app-process-table',
  templateUrl: './process-table.component.html',
  styleUrls: ['./process-table.component.css'],
})
export class ProcessTableComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  processStatus = ProcessStatus;
  processType = ProcessType;
  year = (new Date()).getFullYear();
  month: number;
  years = [ this.year, (this.year - 1) , (this.year - 2), (this.year - 3)];
  months = MONTHS;
  sub = new Subscription;
  location: string;
  processId;
  planId;

  statuses = Object.keys(ProcessStatus).map(function(e) {
    return { id: e, name: ProcessStatus[e] };
  });

  isDisplay = this.userSession.getPermissionsType('operations', true);
  operatorName = 'operator_id';
  organizationName = 'organization_name';
  employerName = 'employer_name';
  role = this.userSession.getRole();

  statuses_selected = [ 'loading',
  'can_be_processed',
  'error_loading' ,
  'loaded_with_errors'];
  readonly columns =  [
    { name: 'date', label: 'תאריך טעינה' , searchOptions: { isDate: true }},
    { name: 'name', label: 'שם תהליך' , searchable: false},
    { name: 'id', label:  'מס תהליך' , searchable: false},
    { name: 'type', label: 'סוג תהליך' , searchable: false},
    { name: this.organizationName , sortName: 'department__employer__organization__name',
      label: 'שם ארגון'  ,  searchable: false},
    // , onSelect: 'loadEmployers($event)'
    { name: this.employerName, sortName: 'department__employer__name', label: 'שם מעסיק'  , searchable: false},
    { name: 'department_name', sortName: 'department__name', label: 'שם מחלקה' , searchable: false},
    { name: this.operatorName, sortName: 'department__employer__operator__first_name',
      label: 'מנהל תיק' , searchOptions: { labels: [] } , isDisplay: this.role === 'admin'},
    { name: 'month', sortName: 'date', label: 'חודש' , searchable: false},
    { name: 'year', label: 'שנה' , isSort: false , searchable: false},
    { name: 'total', label: 'סכום' , searchable: false},
    { name: 'status', label: 'סטטוס' , selected: this.statuses_selected, multiple: true, searchOptions: { labels: this.statuses}},
    { name: 'status_process', label: 'סטטוס תהליך' , isSort: false , searchable: false},
    // { name: 'download', label: 'הורדה', isSort: false },
    {name: 'actions', label: 'פעולות' , isSort: false, isDisplay: this.isDisplay, searchable: false},
  ];

  constructor(public route: ActivatedRoute,
              private router: Router,
              private processService: ProcessService,
              private selectUnit: SelectUnitService,
              private userSession: UserSessionService,
              private platformComponent: PlatformComponent,
              protected notificationService: NotificationService,
              public processDataService: ProcessDataService) {
  }

  ngOnInit() {

    if (this.router.url.includes( 'operator')) {
      this.selectUnit.setEntitySessionStorage(
        this.platformComponent.organizationId,
        this.platformComponent.employerId,
        this.platformComponent.departmentId,
      );

      this.dataTable.criteria.filters['status'] =  this.statuses_selected;
      this.platformComponent.organizations.push({'id': '0', 'name': 'כלל הארגונים'});
      this.platformComponent.organizations.sort((a, b) => a.id - b.id);
      this.selectUnit.changeOrganization( 0);
      this.platformComponent.organizationId = '0';
      this.platformComponent.employerId = '0';
      this.platformComponent.departmentId = 0;

      this.location = 'operator';
    } else {
      this.location = 'process';
    }

    this.processId = this.route.snapshot.queryParams['processId'];
    this.planId = this.route.snapshot.queryParams['planId'];
    this.dataTable.criteria.filters['year'] = this.year;
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
        this.dataTable.paginationData.currentPage = 1;
        this.dataTable.criteria.page = 1;
        this.fetchItems();
      }
    ));

  }

  fetchItems() {

    const organizationId = this.selectUnit.currentOrganizationID;
    const employerId = this.selectUnit.currentEmployerID;
    const departmentId = this.selectUnit.currentDepartmentID;
    if (organizationId || this.router.url.includes( 'operator')) {
      this.dataTable.criteria.filters['departmentId'] = departmentId;
      this.dataTable.criteria.filters['employerId'] = employerId;
      this.dataTable.criteria.filters['organizationId'] = organizationId;
      if (this.processId) {
        this.dataTable.criteria.filters['processId'] = this.processId;
      }

    this.dataTable.criteria.filters['year'] = this.year;
    this.dataTable.criteria.filters['month'] = this.month;


    if (this.location === 'operator') {
      this.dataTable.criteria.filters['location'] = true;
    } else {
      this.dataTable.criteria.filters['location'] = false;
    }

    this.processService.getProcesses(this.dataTable.criteria).then(
      response => {
        const users = response.other['users'];
        const column = this.dataTable.searchColumn(this.operatorName);
        column['searchOptions'].labels = users;
        this.dataTable.setItems(response);
      });
    }
  }

  ngOnDestroy() {
    if (this.router.url.includes( 'operator')) {
      if (this.selectUnit.getEntitySessionStorage()) {
        if ( +this.platformComponent.organizations[0].id === 0) {
          this.platformComponent.organizations.splice(0, 1);
        }
        this.platformComponent.organizationId = this.selectUnit.currentOrganizationID;
        this.platformComponent.employerId = this.selectUnit.currentEmployerID;
        this.platformComponent.departmentId = this.selectUnit.currentDepartmentID;
      }
    }
    this.sub.unsubscribe();
  }

  redirectProcessNew(): void {
    this.router.navigate(['platform', 'process' , 'new', '0']);
  }

  downloadFileProcess(processId: number): void {
    this.processService.downloadFileProcess(processId).then(response => {
      if (response.ok) {
        response['blobs'].forEach((item, index) => {
          const byteCharacters = atob(item);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {type: 'application/dat'});
          const fileURL = URL.createObjectURL(blob);
          FileSaver.saveAs(blob, response['fileNames'][index]);
        });
      }else {
        this.notificationService.error('', ' אין אפשרות להוריד את הקובץ ');
      }
    });
  }

  moveProcess(process: Process): void {
    if (this.location === 'operator') {
      if ( +this.platformComponent.organizations[0].id === 0) {
        this.platformComponent.organizations.splice(0, 1);
      }
      this.platformComponent.organizationId = process.organization_id;
      this.platformComponent.employerId = process.employer_id;
      this.platformComponent.departmentId = process.dep_id;
      this.selectUnit.changeOrganizationEmployerDepartment(
        process.organization_id, process.employer_id, process.dep_id);
      this.platformComponent.agentBarActive = !this.platformComponent.agentBarActive;
      this.selectUnit.setAgentBarActive(this.platformComponent.agentBarActive);
    }
    if (process.status === 'error_loading' ) { return this.messageError(process.error_details) ; }
    if (process.status === 'waiting_for_approval' && this.userSession.getRole() !== 'admin') {
      return this.messageError('ממתין לאישור מנהל') ; }
    const status = this.processStatus[process.status];
   if (status === this.processStatus.loading || status ===  this.processStatus.can_be_processed
    || status === this.processStatus.transmitted
     || status === this.processStatus.loaded_with_errors  || status === this.processStatus.partially_transmitted
   || status === this.processStatus.waiting_for_approval) {
     const date = new Date(process.date);
     const pageNumber = status !== this.processStatus.loading ? 3 : 1;

     const data = {
       'pageNumber': pageNumber,
       'processName': process.name,
       'year': date.getFullYear(),
       'month': date.getMonth() + 1,
       'monthName':  this.months[date.getMonth()],
       'processId': process.id,
       'type': process.type === 'employer_withdrawal' ? 'negative' : 'positive',
       'status': process.status,
       'departmentId': process.dep_id,
       'employerId': process.employer_id
     };

     this.processDataService.setProcess(data);
     if (status === this.processStatus.transmitted) {
       this.router.navigate(['platform', 'process', 'new', '1', 'broadcast']);
     } else {
       if (this.planId) {
         this.router.navigate(['platform', 'process' , 'new', '0', 'payment', process.id],
           {queryParams: {planId: this.planId}});
       } else {
         this.router.navigate(['platform', 'process' , 'new', '0', 'payment', process.id]);
       }

     }

   }
  }

  messageError(error: string): void {
    this.notificationService.error('', error);
  }

  deleteProcess(processId: number): void {
    const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};

    this.notificationService.warning('האם ברצונך למחוק תהליך?', '', buttons).then(confirmation => {
      if (confirmation.value) {

        this.processService.deleteProcess(processId).then(
          response => {
            if (response) {
              this.notificationService.success('המחיקה בוצע בהצלחה' );
              this.fetchItems();
            }else  {
              this.notificationService.error('המחיקה נכשלה', 'אין אפשרות למחוק קובץ ששודר');
            }
          }
        );
      }
    });
  }

  detailsFiles(item): void {
    const year = new Date(item.date);

    this.platformComponent.organizationId =  this.selectUnit.currentOrganizationID;
    this.platformComponent.employerId = item.employer_id;
    this.platformComponent.departmentId = item.dep_id;

    this.selectUnit.changeOrganizationEmployerDepartment(
      this.selectUnit.currentOrganizationID,
      item.employer_id,
      item.dep_id);

    this.router.navigate(['/platform', 'feedback', 'files'],
        {queryParams: {processId: item.id, year: year.getFullYear(), month: year.getMonth() + 1}});
  }
}
