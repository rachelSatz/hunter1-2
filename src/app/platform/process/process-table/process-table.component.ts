import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {PlatformComponent} from '../../platform.component';

@Component({
  selector: 'app-process-table',
  templateUrl: './process-table.component.html',
  styleUrls: ['./process-table.component.css']
})
export class ProcessTableComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  processStatus = ProcessStatus;
  processType = ProcessType;
  year = (new Date()).getFullYear();
  years = [ this.year, (this.year - 1) , (this.year - 2), (this.year - 3)];
  months = MONTHS;
  sub = new Subscription;
  processId;

  isDisplay = this.userSession.getPermissionsType('operations', true);
  readonly columns =  [
    { name: 'name', label: 'שם תהליך' },
    { name: 'id', label: 'מספר תהליך' },
    { name: 'type', label: 'סוג תהליך' },
    { name: 'employer_name', sortName: 'department__employer__name', label: 'שם מעסיק' },
    { name: 'department_name', sortName: 'department__name', label: 'שם מחלקה' },
    { name: 'month', sortName: 'date', label: 'חודש' },
    { name: 'year', label: 'שנה' , isSort: false },
    { name: 'total', label: 'סכום' },
    { name: 'status', label: 'סטטוס ' , isSort: false },
    { name: 'download', label: 'הורדה', isSort: false },
    {name: 'actions', label: 'פעולות' , isSort: false, isDisplay: this.isDisplay},
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
    this.processId = this.route.snapshot.queryParams['processId'];
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

    if (organizationId) {
      this.dataTable.criteria.filters['departmentId'] = departmentId;
      this.dataTable.criteria.filters['employerId'] = employerId;
      this.dataTable.criteria.filters['organizationId'] = organizationId;
      if (this.processId) {
        this.dataTable.criteria.filters['processId'] = this.processId;
      }
      this.processService.getProcesses(this.dataTable.criteria).then(
        response => this.dataTable.setItems(response));
    }
  }

  ngOnDestroy() {
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
    if (process.status === 'error_loading' ) { return this.messageError(process.error_details) ; }
    if (process.status === 'waiting_for_approval' && this.userSession.getRole() !== 'admin') {
      return this.messageError('ממתין לאישור מנהל') ; }

    const status = this.processStatus[process.status];
   if (status === this.processStatus.loading || status ===  this.processStatus.can_be_processed
   || status === this.processStatus.done_processing || status === this.processStatus.transmitted
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
       this.router.navigate(['platform', 'process' , 'new', '0', 'payment', process.id]);
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

        this.processService.deleteProcess( processId).then(
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
