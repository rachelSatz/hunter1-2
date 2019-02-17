import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { ProductService } from 'app/shared/_services/http/product.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { Subscription } from 'rxjs';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { DepositsReportService } from 'app/shared/_services/http/deposits-report.service';
import { FormComponent } from './form/form.component';
import { Status } from 'app/shared/_models/deposits-report.model';
import { CommentsFormComponent } from '../../../shared/_dialogs/comments-form/comments-form.component';


@Component({
  selector: 'app-deposits-report',
  templateUrl: './deposits-report.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css']
})
export class DepositsReportComponent extends DataTableComponent implements OnInit, OnDestroy {

  readonly headers: DataTableHeader[] =  [
    { column: 'created_at', label: 'תאריך יצירת בקשה' }, { column: 'updated_at', label: 'תאריך עדכון בקשה' },
    { column: 'username', label: 'יוצר הבקשה' }, { column: 'employer_name', label: 'מעסיק' },
    { column: 'department_name', label: 'מחלקה' }, { column: 'employee_name', label: 'עובד' },
    { column: 'personal_id', label: 'ת"ז' }, { column: 'company_name', label: 'חברה מנהלת' },
    { column: 'validity_date', label: 'תאריך נכונות' }, { column: 'status', label: 'סטטוס' },
    { column: null, label: 'העבר לטיפול' }, { column: null, label: 'פניות' },
    { column: null, label: 'הערות' }, {column: null, label: 'פרטים' }
  ];

// , { column: null, label: 'הורדה' }

  constructor(protected route: ActivatedRoute,
              private depositsReportService: DepositsReportService,
              private dialog: MatDialog,
              private departmentService: DepartmentService,
              private productService: ProductService,
              private employerService: EmployerService,
              protected notificationService: NotificationService,
              private selectUnit: SelectUnitService) {
    super(route, notificationService);
  }

  sub = new Subscription;
  companies = [];
  users = [];
  statuses = Status;
  selectStatuses = Object.keys(Status).map(function(e) {
    return { id: e, name: Status[e] };
  });

  ngOnInit() {
    this.productService.getCompanies().then(response => this.companies = response);
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => this.fetchItems()));

    super.ngOnInit();
  }

  fetchItems(): void {
    const organizationId = this.selectUnit.currentOrganizationID;
    const employerId = this.selectUnit.currentEmployerID;
    const departmentId = this.selectUnit.currentDepartmentID;

    if (organizationId) {
      this.searchCriteria['employerId'] = employerId;
      this.searchCriteria['organizationId'] = organizationId;
      this.searchCriteria['departmentId'] = departmentId;

      this.depositsReportService.getDepositsReport(this.searchCriteria).then(response => {
        this.setResponse(response);
      });
    }
  }

  setResponse(response: any[]): void {
    this.users  = response.map(item => ({id: item['user_id'], name: item['username']}));
    this.users =  this.users.filter((x) => this.users.indexOf(x) === 0);
    this.setItems(response);
  }


  openFormDialog(): void {
    if (this.selectUnit.currentDepartmentID === 0) {
      this.notificationService.error('יש לבחור מחלקה', '');
      return;
    }

    const dialog = this.dialog.open(FormComponent, {
        data: { companies: this.companies, departmentId: this.selectUnit.currentDepartmentID ,
          employerID: this.selectUnit.currentEmployerID},
        width: '450px'
      });

    this.sub.add(dialog.afterClosed().subscribe(created => {
      if (created) {
        this.fetchItems();
      }
    }));
  }

  openCommentsDialog(): void {
    this.dialog.open(CommentsFormComponent, {
      // data: { companies: this.companies, departmentId: this.selectUnit.currentDepartmentID ,
      //   employerID: this.selectUnit.currentEmployerID},
      width: '450px'
    });
  }

  openDetailsDialog(item: object): void {
    // this.dialog.open(CommentsFormComponent, {
    //   // data: { companies: this.companies, departmentId: this.selectUnit.currentDepartmentID ,
    //   //   employerID: this.selectUnit.currentEmployerID},
    //   width: '450px'
    // });
  }

  openInquiriesDialog(item: object): void {
    // this.dialog.open(CommentsFormComponent, {
    //   // data: { companies: this.companies, departmentId: this.selectUnit.currentDepartmentID ,
    //   //   employerID: this.selectUnit.currentEmployerID},
    //   width: '450px'
    // });
  }

  manualChangingStatus(): void {
    if (this.checkedItems.length === 0) {
      this.setNoneCheckedWarning();
      return;
    }

    this.depositsReportService.manualChangingStatus(this.checkedItems.map(item => item.id)).then(response => {
      if (response) {
        this.checkedItems = [];
        this.isCheckAll = false;
        this.fetchItems();
      }
    });
  }
}
