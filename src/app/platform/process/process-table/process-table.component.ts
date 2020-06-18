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
import { CommentsFormComponent } from 'app/shared/_dialogs/comments-form/comments-form.component';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { MatDialog } from '@angular/material';

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
    // { name: 'type', label: 'סוג תהליך' , searchable: false},
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
    { name: 'comments', label: 'הערות', isSort: false },
    {name: 'actions', label: 'פעולות' , isSort: false, isDisplay: this.isDisplay, searchable: false},
  ];

  constructor(public route: ActivatedRoute,
              private router: Router,
              private helpers: HelpersService,
              private processService: ProcessService,
              private selectUnit: SelectUnitService,
              private userSession: UserSessionService,
              private generalService: GeneralHttpService,
              private dialog: MatDialog,
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
    if (this.route.snapshot.queryParams['employerId']) {
      this.platformComponent.agentBarActive = !this.platformComponent.agentBarActive;
      const employerId = this.route.snapshot.queryParams.employerId;
      const organization = (this.selectUnit.getOrganization()).find(o => o.employer.find(e => e.id === Number(employerId)));
      this.selectUnit.changeOrganizationEmployerDepartment(organization.id, employerId, 0);
      this.platformComponent.organizationId = organization.id;
      this.platformComponent.employerId = employerId;
    } else {
      this.dataTable.criteria.filters['year'] = this.year;
    }
    this.processId = this.route.snapshot.queryParams['processId'];
    this.planId = this.route.snapshot.queryParams['planId'];
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
    if (this.selectUnit.getReportFilters() && this.route.snapshot.queryParams['employerId']) {
      if (!this.selectUnit.getReportFilters().salaryMonth) {
        this.dataTable.criteria.filters['date[from]'] = this.selectUnit.getReportFilters().startDate;
        this.dataTable.criteria.filters['date[to]'] = this.selectUnit.getReportFilters().endDate;
      } else {
        this.dataTable.criteria.filters['startDate'] = this.selectUnit.getReportFilters().startDate;
        this.dataTable.criteria.filters['endDate'] = this.selectUnit.getReportFilters().endDate;
      }
    } else {
      this.dataTable.criteria.filters['year'] = this.year;
      this.dataTable.criteria.filters['month'] = this.month;
    }

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
        this.selectUnit.clearReportFilters();
      });
    }
  }

  getType(type): number {
    if (type === 'employer_payment') {
      return 1;
    } else if (type === 'employer_withdrawal' || type === 'regular_fix' || type === 'employer_payment') {
      return -1;
    }
    return 0;
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
    this.router.navigate(['platform', 'process' , 'new', 'create']);
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
     this.processService.getGroupThingInProcess(process.id).then(response => {
       process.rows = response['group_things_ids'];
       if (process.rows.length === 0) {
         process.rows = undefined;
       }
       process.sum = response['block_sum'];
       process.num_file = response['num_file'];

       const data = {
         'name': process.name,
         'year': date.getFullYear(),
         'month': date.getMonth() + 1,
         'monthName':  this.months[date.getMonth()],
         'processID': process.id,
         'type': process.type === 'employer_withdrawal' ? 'negative' : 'positive',
         'status': process.status,
         'departmentId': process.dep_id,
         'employer_id': process.employer_id,
         'is_references': process.is_references,
         'payment_instructions': process.payment_instructions,
         'status_process': process.status_process === 1 &&
         status !== this.processStatus.can_be_processed ? process.status_process : process.status_process + 1,
         'employer_name': process.employer_name,
         'incorrect': status === this.processStatus.loaded_with_errors,
         'returnDetails':  status === this.processStatus.loaded_with_errors,
         'rows': process.rows,
         'sum': process.sum,
         'num_file': process.num_file,
         'rows_status': response['sent']
       };

       this.processDataService.setProcess(data);
       this.selectUnit.setProcessData(data);


       if (status === this.processStatus.loaded_with_errors || status === this.processStatus.loading) {
         this.router.navigate(['platform', 'process' , 'new', 'update']);
       } else
       if (process.status_process === 1) {
         this.router.navigate(['platform', 'process' , 'new', 'update' , 'payment-instructions']);
       } else if (process.status_process === 2) {
         this.router.navigate(['platform', 'process' , 'new', 'update' , 'reference']);
       } else if (process.status_process === 3) {
         this.router.navigate(['platform', 'process' , 'new', 'update' , 'broadcast']);
       } else if (process.status_process === 4) {
         if (status !== this.processStatus.partially_transmitted) {
           this.router.navigate(['platform', 'process', 'new', 'update', 'feedback'],
             {queryParams: {processId: process.id}});
         } else {
           this.router.navigate(['platform', 'process' , 'new', 'update' , 'payment-instructions']);
         }
       } else if (process.status_process === 5 || process.status_process === 6) {
         this.router.navigate(['platform', 'process' , 'new', 'update' , 'send-feed-employer'],
           {queryParams: {processId: process.id}});
       }
     });
   }
  }

  getTitle(status, status_feedback): string {
    switch (status) {
      case 1: return 'טעינת קובץ';
      case 2: return 'הנחיות לתשלום';
      case 3: return 'צירוף אסמכתא';
      case 4: return 'שידור';
      case 5
      : if (status_feedback === 'feedback_a' || status_feedback === 'part_feedback_a') {
        return 'היזון ראשוני';
      }
      return 'היזון אחרון';
      case 6: return 'שליחת היזון למעסיק';

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

  openWarningMessageComponentDialog(type): void {
    const body = !type ? 'האם ברצונך להפוך שורת אלו ללא רלוונטיות?' : 'האם ברצונך להפוך שורת אלו לרלוונטיות?';

    if (this.checkedRowItems()) {
    const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};
    const items = this.dataTable.criteria.checkedItems;

    this.notificationService.warning(body, '', buttons).then(confirmation => {
    if (confirmation.value) {
    this.processService.updateProcess( type, items.map(item => item['id']), this.dataTable.criteria )
      .then(response => {
        if (response) {
          this.endAction();
        } else {
          this.notificationService.error('', 'הפעולה נכשלה');
        }});
    }});
    }
  }

  checkedRowItems(): boolean {
    if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
      this.dataTable.setNoneCheckedWarning();
      return false;
    }
    return true;
  }

  endAction(): void {
    this.dataTable.criteria.checkedItems = [];
    this.dataTable.criteria.isCheckAll = false;
    this.fetchItems();
  }

  openCommentsDialog(item?: any): void {
    let ids = [];
    if (!item) {
      if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
        this.dataTable.setNoneCheckedWarning();
        return;
     }
      ids = this.dataTable.criteria.checkedItems.map(i => i['id']);
      this.openCommentsForm([], ids);
    } else {
      ids = [item.id];
      let comments = null;
      this.generalService.getComments(ids, 'process').then(response => {
        comments = response;
        this.openCommentsForm(comments, ids);
      });
    }
  }

  openCommentsForm(comments, ids): void {
    const dialog =  this.dialog.open(CommentsFormComponent, {
      data: {'ids': ids, 'contentType': 'process', 'comments'  : comments,
        'criteria': this.dataTable.criteria},
      width: '550px',
      panelClass: 'dialog-file'
    });

    this.sub.add(dialog.afterClosed().subscribe(res => {
      this.dataTable.criteria.checkedItems = [];
      this.dataTable.criteria.isCheckAll = false;
      this.fetchItems();
    }));
  }

}
