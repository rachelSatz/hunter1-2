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
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { CompensationSendingMethods } from 'app/shared/_models/compensation.model';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { DataTableResponse } from 'app/shared/data-table/classes/data-table-response';
import { InquiriesComponent } from 'app/shared/_dialogs/inquiries/inquiries.component';
import { DepositsReportService } from 'app/shared/_services/http/deposits-report.service';
import { InquiryFormComponent } from 'app/shared/_dialogs/inquiry-form/inquiry-form.component';
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
              private selectUnit: SelectUnitService,
              private generalService: GeneralHttpService,
              public userSession: UserSessionService
              ) {}

  sub = new Subscription;
  newCompanies = [];
  users = [];
  statuses = Status;
  selectStatuses = Object.keys(Status).map(function(e) {
    return { id: e, name: Status[e] };
  });
  sendingMethods = CompensationSendingMethods;
  nameCompany = 'company_name';
  nameUserId = 'user_id';

  readonly columns =  [
    { name: 'created_at', label:  'תאריך יצירת בקשה', searchable: false },
    { name: 'updated_at', label: 'תאריך עדכון בקשה', searchable: false},
    { name: this.nameUserId, label: 'יוצר הבקשה', searchOptions: { labels: [] }},
    { name: 'employer_name', label: 'מעסיק', sortName: 'employer__name', searchable: false},
    { name: 'department_name', label: 'מחלקה', sortName: 'employee__department__name' , searchable: false},
    { name: 'employee_name', label: 'עובד', sortName: 'employee__first_name', searchable: false},
    { name: 'personal_id', label: 'ת"ז', sortName: 'employee__identifier', searchable: false},
    { name: this.nameCompany, label: 'חברה מנהלת', sortName: 'company__name', searchOptions: { labels: [] }},
    { name: 'from_date', label: 'מתאריך', searchable: false},
    { name: 'to_date', label: 'עד מתאריך', searchable: false},
    { name: 'sending_method', label: 'מקור המידע', searchable: false },
    { name: 'status', label: 'סטטוס', searchOptions: { labels: this.selectStatuses }},
    { name: 'comment', label: 'הערות', isSort: false, searchable: false},
  ];

  ngOnInit() {
    this.dataTable.placeHolderSearch = 'חפש עובד';
    this.productService.getCompanies().then(response => {
      const column = this.dataTable.searchColumn(this.nameCompany);
      this.newCompanies = response;
      column['searchOptions'].labels = this.newCompanies;
    });
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
      this.dataTable.criteria.filters['employerId'] = employerId;
      this.dataTable.criteria.filters['organizationId'] = organizationId;
      this.dataTable.criteria.filters['departmentId'] = departmentId;
      this.depositsReportService.getDepositsReport(this.dataTable.criteria).then(response => {
        this.setResponse(response);
      });
    }
  }

  setResponse(response: DataTableResponse): void {
    const users  = response.other['users'];
    const column = this.dataTable.searchColumn(this.nameUserId);
    column['searchOptions'].labels =  users;
    this.dataTable.setItems(response);
  }

  openFormDialog(): void {
    if (this.selectUnit.currentDepartmentID === 0) {
      this.notificationService.error('יש לבחור מחלקה', '');
      return;
    }

    const dialog = this.dialog.open(FormComponent, {
        data: { 'companies': this.newCompanies, 'departmentId': this.selectUnit.currentDepartmentID},
        width: '450px',
        panelClass: 'form-dialog'
      });

    this.sub.add(dialog.afterClosed().subscribe(created => {
      if (created) {
        this.fetchItems();
      }
    }));
  }

  openCommentsDialog(item: any): void {
    const dialog = this.dialog.open(CommentsFormComponent, {
      data: {'id': item.id, 'contentType': 'depositsreport', 'comments' : item.comments},
      width: '450px'
    });

    this.sub.add(dialog.afterClosed().subscribe(comments => {
      if (comments) {
        this.generalService.getComments(item.id, 'depositsreport').then(response => {
          item.comments = response;
        });
      }
    }));
  }

  openInquiriesDialog(item: any): void {
    if (item.inquiries.length === 0) {
      return;
    }

    this.dialog.open(InquiriesComponent, {
      data: {'id': item.id, 'contentType': 'depositsreport', 'inquiries': item.inquiries},
      width: '800px'
    });
  }

  openInquiriesFormDialog(item: any): void {
    const dialog = this.dialog.open(InquiryFormComponent, {
      data: {'id': item.id, 'contentType': 'depositsreport',
        'employerId': item.employer_id, 'companyId': item.company_id},
      width: '450px'
    });

    this.sub.add(dialog.afterClosed().subscribe(created => {
      if (created) {
        this.generalService.getInquiries(item.id, 'depositsreport').then(response =>
          item.inquiries = response
        );
      }
    }));
  }

  sendDepositReport(id: number): void {
    this.depositsReportService.sendDepositReport(id).then(response => {
      if (response) {
        this.fetchItems();
      }
    });
  }

  manualChangingStatus(): void {
    if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
      this.dataTable.setNoneCheckedWarning();
      return;
    }
    const items = this.dataTable.criteria.checkedItems.map(item => item['id']);

      this.depositsReportService.manualChangingStatus(items, this.dataTable.criteria).then(response => {
        if (response['message'] === true) {
          if (this.dataTable.criteria.isCheckAll) {
            // this.dataTable.items = [];
            this.dataTable.criteria.isCheckAll = false;
          } else {
            this.dataTable.criteria.checkedItems = [];
          }
          this.fetchItems();
          this.notificationService.success('הרשומות עודכנו בהצלחה');
        } else {
          this.notificationService.error('אירעה שגיאה');
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
