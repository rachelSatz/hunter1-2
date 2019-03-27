import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';

import { FormComponent } from './form/form.component';
import { AddFileComponent } from './add-file/add-file.component';
import { Status } from 'app/shared/_models/deposits-report.model';
import { ProductService } from 'app/shared/_services/http/product.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { DataTableComponent } from 'app/shared/data-table-1/data-table.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { InquiriesComponent } from 'app/shared/_dialogs/inquiries/inquiries.component';
import { DepositsReportService } from 'app/shared/_services/http/deposits-report.service';
import { InquiryFormComponent } from 'app/shared/_dialogs/inquiry-form/inquiry-form.component';
import { DataTableResponse } from 'app/shared/data-table-1/classes/data-table-response';
import { CommentsFormComponent } from 'app/shared/_dialogs/comments-form/comments-form.component';
import { RequestDepositsReportComponent } from './excel/request-deposits-report/request-deposits-report.component';


@Component({
  selector: 'app-deposits-report',
  templateUrl: './deposits-report.component.html'
})
export class DepositsReportComponent implements OnInit {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  constructor(protected route: ActivatedRoute,
              private depositsReportService: DepositsReportService,
              private dialog: MatDialog,
              private departmentService: DepartmentService,
              private productService: ProductService,
              private employerService: EmployerService,
              protected notificationService: NotificationService,
              private selectUnit: SelectUnitService) {
  }

  sub = new Subscription;
  companies = [];
  users = [];
  statuses = Status;
  selectStatuses = Object.keys(Status).map(function(e) {
    return { id: e, name: Status[e] };
  });

  nameCompany = 'company_name';
  nameUserId = 'user_id';

  readonly columns =  [
    { name: 'created_at', label: 'תאריך יצירת בקשה' , searchable: false },
    { name: 'updated_at', label: 'תאריך עדכון בקשה' , searchable: false},
    { name: this.nameUserId, label: 'יוצר הבקשה' , searchOptions: { labels: [] }},
    { name: 'employer_name', label: 'מעסיק' , sortName: 'department__employer__name', searchable: false},
    { name: 'department_name', label: 'מחלקה' , sortName: 'department__name' , searchable: false},
    { name: 'employee_name', label: 'עובד' , sortName: 'employee__first_name', searchable: false},
    { name: 'personal_id', label: 'ת"ז' , sortName: 'employee__identifier', searchable: false},
    { name: this.nameCompany, label: 'חברה מנהלת' , sortName: 'company__name', searchOptions: { labels: [] }},
    { name: 'validity_date', label: 'תאריך נכונות' , searchable: false},
    { name: 'status', label: 'סטטוס', searchOptions: { labels: this.selectStatuses }},
    { name: 'response_time', label: 'העבר לטיפול' , searchable: false},
    { name: 'request', label: 'פניות' , searchable: false},
    { name: 'comment', label: 'הערות' , searchable: false},
    { name: 'details', label: 'פרטים' , searchable: false}
  ];

  ngOnInit() {
    this.dataTable.placeHolderSearch = 'חפש עובד';
    this.productService.getCompanies().then(response => {
      const column = this.dataTable.searchColumn(this.nameCompany);
      this.companies = response;
      column['searchOptions'].labels = this.companies;
    });
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => this.fetchItems()));
  }

  fetchItems() {
    const organizationId = this.selectUnit.currentOrganizationID;
    const employerId = this.selectUnit.currentEmployerID;
    const departmentId = this.selectUnit.currentDepartmentID;

    if (organizationId) {
      this.dataTable.criteria.filters['employerId'] = employerId;
      this.dataTable.criteria.filters['organizationId'] = organizationId;
      this.dataTable.criteria.filters['departmentId'] = departmentId;
      this.dataTable.criteria.filters['limit'] =  this.dataTable.limit;

      this.depositsReportService.getDepositsReport(this.dataTable.criteria).then(response => {
        this.setResponse(response);
      });
    }
  }

  setResponse(response: DataTableResponse): void {
    const users  = response.items.map(item => ({id: item['user_id'], name: item['username']}));
    const column = this.dataTable.searchColumn(this.nameUserId);
    column['searchOptions'].labels =  users.filter((x) => users.indexOf(x) === 0);
    this.dataTable.setItems(response);
  }

  openFormDialog(): void {
    if (this.selectUnit.currentDepartmentID === 0) {
      this.notificationService.error('יש לבחור מחלקה', '');
      return;
    }

    const dialog = this.dialog.open(FormComponent, {
        data: { companies: this.companies, departmentId: this.selectUnit.currentDepartmentID ,
          departmentID: this.selectUnit.currentDepartmentID},
        width: '450px'
      });

    this.sub.add(dialog.afterClosed().subscribe(created => {
      if (created) {
        this.fetchItems();
      }
    }));
  }

  openCommentsDialog(item: any): void {
    this.dialog.open(CommentsFormComponent, {
      data: {'id': item.id, 'contentType': 'depositsreport'},
      width: '450px'
    });
  }

  openInquiriesDialog(item: any): void {
    this.dialog.open(InquiriesComponent, {
      data: {'id': item.id, 'contentType': 'depositsreport',
        'employerId': this.selectUnit.currentEmployerID, 'companyId': item.company_id},
      width: '800px'
    });
  }

  openInquiriesFormDialog(item: any): void {
    this.dialog.open(InquiryFormComponent, {
      data: {'id': item.id, 'contentType': 'depositsreport',
        'employerId': this.selectUnit.currentEmployerID, 'companyId': 5},
      width: '450px'
    });
  }

  manualChangingStatus(): void {
    if (this.dataTable.criteria.checkedItems.length === 0) {
      this.dataTable.setNoneCheckedWarning();
      return;
    }

    this.depositsReportService.manualChangingStatus(
      this.dataTable.criteria.checkedItems.map(item => item['id'])).then(response => {
      if (response) {
        // this.checkedItems = [];
        // this.isCheckAll = false;
        this.fetchItems();
      }
    });
  }

  openExcelDialog(): void {
    if (this.selectUnit.currentEmployerID > 0) {
      const dialog = this.dialog.open(RequestDepositsReportComponent, {
        width: '450px'
      });

      this.sub.add(dialog.afterClosed().subscribe(() => {
        this.fetchItems();
      }));

    }else {
      this.notificationService.error('לא נבחר מעסיק', 'יש לבחור מעסיק');
    }
  }

  openDetailsDialog(item: Object): void {
    const dialog = this.dialog.open(AddFileComponent, {
      data: item,
      width: '680px'
    });

    this.sub.add(dialog.afterClosed().subscribe(created => {
      if (created) {
        this.fetchItems();
      }
    }));
  }
}
