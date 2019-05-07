import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild  } from '@angular/core';

import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs/Subscription';

import { HelpersService } from 'app/shared/_services/helpers.service';
import { ProductService } from 'app/shared/_services/http/product.service';
import { placeholder, slideToggle } from 'app/shared/_animations/animation';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { InquiriesComponent } from 'app/shared/_dialogs/inquiries/inquiries.component';
import { InquiryFormComponent } from 'app/shared/_dialogs/inquiry-form/inquiry-form.component';
import { CommentsFormComponent } from 'app/shared/_dialogs/comments-form/comments-form.component';
import { CompensationStatus, CompensationSendingMethods, ValidityMethods } from 'app/shared/_models/compensation.model';
import { FormComponent } from './form/form.component';
import {ProductType} from '../../../shared/_models/product.model';


@Component({
  selector: 'app-process',
  templateUrl: './process-clearing.component.html',
  styleUrls: ['./process-clearing.component.css'],
  animations: [ slideToggle, placeholder ]
})
export class ProcessClearingComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  sub = new Subscription;

  statuses = CompensationStatus;
  selectStatuses = Object.keys(CompensationStatus).map(function(e) {
    return { id: e, name: CompensationStatus[e] };
  });

  sendingMethods = CompensationSendingMethods;
  employers = [];
  companies = [];
  sourceTypes = Object.keys(CompensationSendingMethods).map(function(e) {
    return { id: e, name: CompensationSendingMethods[e] };
  });
  responseTimes = [{id: 2, name: '0-2'}, {id: 4, name: '2-4'}, {id: 5, name: '5+'}];
  productTypes = ProductType;
  nameUserId = 'user_id';

  readonly columns  = [
    { name: 'created_at', label: 'תאריך יצירת בקשה', searchOptions: { isDate: true }},
    { name: 'updated_at', label: 'תאריך עדכון בקשה', searchable: false},
    { name: this.nameUserId, label: 'יוצר הבקשה', searchOptions: { labels: [] } },
    { name: 'employer_name', label: 'מעסיק', sortName: 'department__employer__name', searchable: false},
    { name: 'employee', label: 'עובד', sortName: 'employee__first_name', searchable: false},
    { name: 'personal_id', label: 'ת"ז', sortName: 'employee__identifier', searchable: false},
    { name: 'validity_date', label: 'תאריך נכונות', searchable: false},
    { name: 'sending_method', label: 'מקור המידע', searchOptions: { labels: this.sourceTypes } },
    { name: 'status', label: 'סטטוס', searchOptions: { labels: this.selectStatuses }},
    { name: 'response_time', label: 'העבר לטיפול' ,
      isSort: false, subLabel: 'ימי טיפול', searchOptions: { labels: this.responseTimes }},
    { name: 'request', label: 'פניות' , isSort: false, searchable: false},
    { name: 'comment', label: 'הערות' , isSort: false, searchable: false},
    { name: 'download', label: 'הורדה' , isSort: false, searchable: false },
    { name: 'extend', label: 'הרחבה' , isSort: false, searchable: false },
  ];

  constructor(protected route: ActivatedRoute,
              private compensationService: CompensationService,
              private dialog: MatDialog,
              private departmentService: DepartmentService,
              private productService: ProductService,
              private employerService: EmployerService,
              protected notificationService: NotificationService,
              private selectUnit: SelectUnitService,
              private helpers: HelpersService) {
  }

  ngOnInit() {

    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
        this.dataTable.paginationData.currentPage = 1;
        this.dataTable.criteria.page = 1;
        this.fetchItems();
      }
    ));
    this.dataTable.placeHolderSearch = 'חפש עובד';
  }

  fetchItems() {
    const organizationId = this.selectUnit.currentOrganizationID;
    const employerId = this.selectUnit.currentEmployerID;
    const departmentId = this.selectUnit.currentDepartmentID;

    if (organizationId) {
      this.dataTable.criteria.filters['employerId'] = employerId;
      this.dataTable.criteria.filters['organizationId'] = organizationId;
      this.dataTable.criteria.filters['departmentId'] = departmentId;
      this.dataTable.criteria.filters['eventCode'] = '9302';
      this.compensationService.getCompensations(this.dataTable.criteria).then(response => {
        this.setResponse(response);
      });
    }
  }

  setResponse(response: any): void {
    const users  = response.other['users'];
    const column = this.dataTable.searchColumn(this.nameUserId);
    column['searchOptions'].labels =  users;
    this.dataTable.setItems(response);
  }

  sendCompensations(): void {
    if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
      this.dataTable.setNoneCheckedWarning();
      return;
    }
    this.helpers.setPageSpinner(true);
    this.compensationService.sendCompensations(this.dataTable.criteria.checkedItems.map(
      item => item['id']), this.dataTable.criteria).then(response => {
      this.helpers.setPageSpinner(false);
      if (response) {
        if (response['list_exceptions'].length > 0) {
          this.notificationService.error('הבקשות נכשלו. ' + response['list_exceptions'] ,
            ' הבקשות נכשלו.  ' + response['message'] );
        }else {
          this.notificationService.success('הבקשות נשלחו בהצלחה.');
          this.dataTable.criteria.checkedItems = [];
          this.dataTable.criteria.isCheckAll = false;
          this.fetchItems();
        }
      }else {
        this.notificationService.error(' הבקשות נכשלו. ', 'הבקשות נכשלו.');
      }
    });
  }

  manualChangingStatus(): void {
    if ((!this.dataTable.criteria ||
      this.dataTable.criteria.checkedItems.length === 0)
      && !this.dataTable.criteria.isCheckAll) {
      this.dataTable.setNoneCheckedWarning();
      return;
    }

    this.compensationService.manualChangingStatus(
      this.dataTable.criteria.checkedItems.map(item => item['id'], this.dataTable.criteria),
      this.dataTable.criteria).then(response => {
      this.dataTable.criteria.checkedItems = [];
      this.dataTable.criteria.isCheckAll = false;
      this.setResponse(response);
    });
  }

  openCommentsDialog(item: any): void {
    const dialog = this.dialog.open(CommentsFormComponent, {
      data: {'id': item.id, 'contentType': 'compensation'},
      width: '450px'
    });

    this.sub.add(dialog.afterClosed().subscribe(comments => {
      if (comments) {
        item['comments'] = comments;
      }
    }));
  }

  openInquiriesDialog(compensation: Object): void {
    if (compensation['inquiry_count'] === 0) {
      return;
    }

    this.dialog.open(InquiriesComponent, {
      data: {'id': compensation['id'], 'contentType': 'compensation'},
      width: '800px'
    });
  }

  openSendToDialog(item: Object): void {
    this.dialog.open(InquiryFormComponent, {
      data: {'id': item['id'], 'contentType': 'compensation',
        'employerId': this.selectUnit.currentEmployerID,
        'companyId': item['company_id'],
        'error_details': item['feedback_level'] === 'record' ?
          item['error_details'] :  item['error_details_file'],
        'ans_manuf': item['answering_manufacturer'],
        'feedback_level': item['feedback_level']
      },
      width: '500px'
    });
  }

  PdfFile(rowId: number, type: string): any {
    this.compensationService.downloadPdfFile(rowId).then(response => {
      if (response) {
        const byteCharacters = atob(response['data']);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(blob);
        if (type === 'show') {
          window.open(fileURL);
        } else {
          FileSaver.saveAs(blob, 'Compensation-Request-Reply.pdf');
        }
      }else {
        type =  type === 'show' ?  'להציג' : 'להוריד';
        this.notificationService.error('', ' אין אפשרות ' + type +  ' קובץ ');
      }
    });
  }

  openFormDialog(): void {
    if (this.selectUnit.currentEmployerID === 0) {
      this.notificationService.error('יש לבחור מעסיק', '');
      return;
    }

    const dialog = this.dialog.open(FormComponent,
      {
        data: {
          companies: this.companies, departmentId: this.selectUnit.currentDepartmentID,
          employerID: this.selectUnit.currentEmployerID
        },
        width: '450px'
      });

    this.sub.add(dialog.afterClosed().subscribe(() =>
      this.fetchItems()
    ));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
