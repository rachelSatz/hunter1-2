import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { placeholder, slideToggle } from 'app/shared/_animations/animation';
import { EmployerStatus } from 'app/shared/_models/employer.model';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { ReportFilters } from '../../../shared/_models/report_manage';
import { NotificationService } from '../../../shared/_services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { GroupDetailsComponent } from './group-details/group-details.component';
import {PlatformComponent} from '../../platform.component';


@Component({
  selector: 'app-employers',
  templateUrl: './employers.component.html',
  styles: ['.operator-container {margin-right: 60px}'],
  animations: [ slideToggle, placeholder]
})
export class EmployersComponent  implements OnInit , OnDestroy {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  status = Object.keys(EmployerStatus).map(function(e) {
    return { id: e, name: EmployerStatus[e] };
  });
  reportsFilters = new ReportFilters;
  operators = [];
  operatorName = 'user_id';
  sub = new Subscription;
  location: string;
  documents: string[];
  operator;
  statusEmployer;
  userId: number;
  employerStatus = EmployerStatus;
  employerId: number;
  role = this.userSession.getRole();
  readonly columns =  [
    { name: 'organization_name', label: 'ארגון', searchable: false },
    { name: 'employer_name', label: 'מעסיק' , searchable: false},
    { name: 'entity_number', label: 'מספר ח"פ' , searchable: false},
    { name: this.operatorName, label: 'מנהל תיק', selected: this.operator, searchOptions: {labels: [] }},
    { name: 'email', label: 'כתובת מייל' , searchable: false},
    { name: 'phone', label: 'טלפון' , searchable: false},
    { name: 'mobile', label: 'טלפון נייד' , searchable: false},
    { name: 'address', label: 'כתובת' , searchable: false},
    { name: 'status', label: 'סטטוס', selected: this.statusEmployer, searchOptions: { labels: this.status }}

  ];

  constructor(protected route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private notificationService: NotificationService,
              private employerService: EmployerService,
              private platformComponent: PlatformComponent,
              public  userSession: UserSessionService,
              private selectUnit: SelectUnitService) {
  }

  ngOnInit() {
    if (this.route.snapshot.queryParams['report']) {
      this.location = 'report';
      this.platformComponent.agentBarActive = !this.platformComponent.agentBarActive;
    } else if (this.router.url.includes( 'operator')) {
      this.location = 'operator';
    } else {
      this.location = 'settings';
    }
    this.userId = this.userSession.getUserModules() ? this.userSession.getUserModules()[0].user_id : 0;
    this.employerService.getOperator().then(response => {
      const column = this.dataTable.searchColumn(this.operatorName);
      this.operators = response;
      this.operators.push({'id': '0', 'name': 'ללא מנהל תיק'});
      column['searchOptions'].labels = this.operators;
    });

    if (this.userSession.newEmployers > 0 && this.location === 'operator') {
      this.dataTable.criteria.filters['operatorId'] = this.role === 'admin' ? 0 : this.userId;
      this.dataTable.criteria.filters['status'] = 'moved_association';
    }
    this.reportsFilters = this.selectUnit.getReportFilters();
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
        this.router.navigate([], {
          queryParams: {page: 1},
          relativeTo: this.route
        });
        this.fetchItems();
      }
    ));
  }

  employerEdit(employer): void {
    if (employer.status === 'on_process' || employer.status === 'moved_association') {
        this.router.navigate(['./', 'creating', employer.id], {relativeTo: this.route});
    } else {
      this.router.navigate(['./', 'form' , employer.id],  {relativeTo: this.route});
    }
  }

  fetchItems() {
    if (this.userSession.newEmployers > 0) {
      const column = this.dataTable.searchColumn('status');
      column['selected'] = this.userSession.newEmployers > 0 ? 'moved_association' : null;
      const columnOperator = this.dataTable.searchColumn('user_id');
      columnOperator['selected'] = this.role === 'admin' ? '0' : this.userId.toString();
    }
    this.dataTable.criteria.filters['organizationId'] = this.selectUnit.currentOrganizationID;
    this.dataTable.criteria.filters['employerId'] = this.selectUnit.currentEmployerID;
    this.dataTable.criteria.filters['location'] = this.location;
    if (this.reportsFilters) {
      this.dataTable.criteria.filters['employerId'] = this.reportsFilters.employerId;
      this.dataTable.criteria.filters['operatorId'] = this.reportsFilters.operatorId;
      this.dataTable.criteria.filters['organizationId'] = this.reportsFilters.organizationId;
      this.dataTable.criteria.filters['projectId'] = this.reportsFilters.projectId;
      this.dataTable.criteria.filters['status'] = 'active';
    }
    this.employerService.getAllEmployers(this.dataTable.criteria).then(
        response => this.setResponse(response));
    this.selectUnit.clearReportFilters();
  }

  previous(): void {
    if (this.location === 'report') {
      this.router.navigate(['/platform', 'operator', 'reports']);
    }
  }

  setResponse(response: any): void {
    this.dataTable.setItems(response);
  }

  createOrSelectGroup(mode: string) {
    const title = mode === 'create' ? 'הקבוצה נוצרה בהצלחה' : 'המעסיקים נוסף בהצלחה' ;
    // if (this.dataTable.criteria.checkedItems.length === 0 ||
    //    (!this.dataTable.criteria.isCheckAll && this.dataTable.criteria.checkedItems.some(item =>
    //     item['status'] !== 'active' )) || (this.dataTable.criteria.isCheckAll && this.dataTable.items.some(item =>
    //     item['status'] !== 'active' ))) {
    //   this.notificationService.warning('יש לבחור מעסיקים פעילים');
    //   return;
    // }
    const dialog = this.dialog.open(GroupDetailsComponent, {
      data: {
        'isCheckAll': this.dataTable.criteria.isCheckAll,
        'employers': this.dataTable.criteria.checkedItems ,
        'mode': mode,
      },
      width: '400px',
      panelClass: 'employer'
    });

    this.sub.add(dialog.afterClosed().subscribe(response => {
      if (response === 'success') {
        this.notificationService.success(title);
      } else if (response === 'error') {
        this.notificationService.error('יצירת הקבוצה נכשלה');
      }
      this.dataTable.criteria.checkedItems = [];
      this.dataTable.criteria.isCheckAll = false;
    }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
