import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { MatDialog } from '@angular/material';


import { DefrayalError, DepositStatus, DepositType, EmployeeStatus } from 'app/shared/_models/monthly-transfer-block';
import { SendEmailIncorrectComponent } from './send-email-incorrect/send-email-incorrect.component';
import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';
import { DataTableResponse } from 'app/shared/data-table/classes/data-table-response';
import { GroupTransferComponent } from '../group-transfer/group-transfer.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { ProductType } from 'app/shared/_models/product.model';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detailed-records',
  templateUrl: './detailed-records.component.html',
  styleUrls: ['./detailed-records.component.css']
})
export class DetailedRecordsComponent implements OnInit , OnDestroy {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  @Input() items = [];

  nameEmployerProductCode = 'product_id';
  employerProductId = 'employer_product_id';
  nameEmployeeName = 'employee_id';

  depositType = Object.keys(DepositType).map(function(e) {
    return { id: e, name: DepositType[e] };
  });

  permissionsType = this.userSession.getPermissionsType('operations');
  readonly columns =  [
    { name: this.nameEmployeeName , sortName: 'employee_chr__employee__first_name', label: 'שם העובד' , searchOptions: { labels: [] }},
    { name: 'personal_id',  sortName: 'employee_chr__employee__identifier', label: 'תעודת זהות' , searchable: false },
    { name: 'deposit_type', label: 'סוג תקבול' , searchOptions: { labels: this.depositType } },
    { name: this.nameEmployerProductCode , sortName: 'employer_product__code', label: 'מספר קופה בשכר',
      subLabel: 'שם קופה', searchOptions: { labels: [] } },
    { name: this.employerProductId, sortName: 'employer_product__code', label: 'שם קופה בשכר' , searchOptions: { labels: [] } },
    { name: 'employer_product_type', sortName: 'employer_product__type', label: 'סוג קופה' , searchable: false },
    { name: 'deposit_status', isSort: false , label: 'מעמד' , searchable: false },
    { name: 'employee_status', isSort: false , label: 'סטטוס' , searchable: false },
    { name: 'product_code', sortName: 'employer_product__product__code', label: 'מ"ה' , searchable: false },
    { name: 'payment_month', isSort: false, label: 'חודש ייחוס' , searchable: false },
    { name: 'salary', label: 'שכר' , searchable: false},
    { name: 'sum_compensation', isSort: false, label: 'פיצויים' , searchable: false },
    { name: 'sum_employer_benefits', isSort: false, label: 'הפרשת מעסיק' , searchable: false },
    { name: 'sum_employee_benefits', isSort: false, label:  'הפרשת עובד' , searchable: false } ,
    { name: 'amount', isSort: false, label: 'סה"כ' , searchable: false }
  ];

  constructor(public route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              public processDataService: ProcessDataService,
              public userSession: UserSessionService,
              private  monthlyTransferBlockService: MonthlyTransferBlockService ,
              protected  notificationService: NotificationService,
              private selectUnitService: SelectUnitService) { }
  sub = new Subscription;
  subscription = new Subscription;
  depositStatus = DepositStatus;
  employeeStatus = EmployeeStatus;
  depositTypes = DepositType;
  defrayalError = DefrayalError;
  productType = ProductType;
  records_id = 0;
  highlightRecordId: number;
  organizationId: number;
  incorrectPage = false;

  ngOnInit() {
    this.organizationId = this.selectUnitService.currentOrganizationID;

    if (this.processDataService.activeProcess === undefined) {
      this.processDataService = this.selectUnitService.getProcessData();
    }

    this.records_id = this.route.snapshot.params['id'];
    this.records_id =  this.records_id === undefined ? 0 :  this.records_id;

    this.monthlyTransferBlockService.getEntity(this.processDataService.activeProcess.processID,  this.records_id)
      .then(response => {
        let column = this.dataTable.searchColumn(this.nameEmployeeName);
        column['searchOptions'].labels = response['employees'];
        column = this.dataTable.searchColumn(this.nameEmployerProductCode);
        column['searchOptions'].labels = response['products'];
        column = this.dataTable.searchColumn(this.employerProductId);
        column['searchOptions'].labels = response['employer_products'];
      });
    this.subscription.add(this.selectUnitService.unitSubject.subscribe(() => this.fetchItems()));
  }

  fetchItems() {
    if (this.organizationId !== this.selectUnitService.currentOrganizationID) {
      this.router.navigate(['/platform', 'process', 'table']);
    }
    if (this.items.length <= 0) {
      this.dataTable.criteria.filters['processId'] = this.processDataService.activeProcess.processID;
      if (this.records_id !== 0) {
        this.dataTable.criteria.filters['recordsId'] = this.records_id;
      }
      if (this.processDataService.activeProcess.incorrect) {
        this.dataTable.criteria.filters['incorrect'] = this.processDataService.activeProcess.incorrect;
        this.incorrectPage = this.processDataService.activeProcess.incorrect;
      }
      if (this.processDataService.activeProcess.highlightRecordId !== undefined) {
        this.dataTable.criteria.filters['highlightRecordId'] = this.processDataService.activeProcess.highlightRecordId;
      }
      this.monthlyTransferBlockService.getMonthlyList(this.dataTable.criteria)
        .then(response => {
          if (response.items.length > 0 || !this.incorrectPage) {
            this.dataTable.setItems(response);
          } else {
            if (this.processDataService.activeProcess.pageNumber === 4 || this.processDataService.activeProcess.pageNumber === 5) {
              this.router.navigate(['/platform', 'process', 'new', 1, 'broadcast']);
            } else {
              this.router.navigate(['/platform', 'process', 'new', 1 , 'payment', this.processDataService.activeProcess.processID]);
            }
          }
        });
    } else {
      const data = new DataTableResponse( this.items, 1, this.items.length);
      this.dataTable.setItems(data);
    }
  }

  openGroupTransferDialog(): void {
    if (this.checkedRowItems()) {
      if (this.isLockedBroadcast()) {
          const ids = this.dataTable.criteria.checkedItems.map(item => item['id']);
          // let isDoubleEntity = false;
          // this.dataTable.items.forEach(i => {
          //   if (!isDoubleEntity) {
          //     this.dataTable.criteria.checkedItems.forEach(c => {
          //       if (i.id !== c['id'] && i.personal_id === c['personal_id'] &&
          //         i.product_id === c['product_id'] && i.employer_product_code === c['employer_product_code']) {
          //         isDoubleEntity = true;
          //         return;
          //       }
          //     });
          //   } else{
          //     return;
          //   }
          // });
          const dialog = this.dialog.open(GroupTransferComponent, {
            data: { 'ids': ids,
                    'processId': this.processDataService.activeProcess.processID,
                    'type': 'mtb',
                    'dataTable': this.dataTable.criteria
            },
            width: '800px',
            panelClass: 'dialog-file'
          });
          this.sub.add(dialog.afterClosed().subscribe(() => {
            if (this.dataTable.criteria.isCheckAll) {
              this.dataTable.criteria.isCheckAll = false;
            } else {
              this.dataTable.criteria.checkedItems = [];
            }
            this.fetchItems();
          }));


      }else {
        this.notificationService.error('', 'אין אפשרות לעדכן רשומה נעולה');
      }
    }
  }

  checkedRowItems(): boolean {
    if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
      this.dataTable.setNoneCheckedWarning();
      return false;
    }
    return true;
  }

  openWarningMessageComponentDialog(type: boolean): void {
    const title = type ? 'לא רלונטי' : 'מחיקת שורות';
    const body = type ? 'האם ברצונך להפוך שורת אלו ללא רלונטית?' : 'האם ברצונך למחוק שורת אלו?';
    const typeData = type ? 'notRelevant' : 'delete';
    if (this.checkedRowItems()) {
      if (this.isLockedBroadcast()) {
        const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};
        const items = this.dataTable.criteria.checkedItems;

        this.notificationService.warning(title, body, buttons).then(confirmation => {
          if (confirmation.value) {
            this.monthlyTransferBlockService.update(typeData, '', items.map(item => item['id']), this.dataTable.criteria)
              .then(response => {
                if (response['message'] === 'true') {
                  this.notificationService.success('העידכון בוצע בהצלחה');
                  this.fetchItems();
                  this.dataTable.criteria.checkedItems = [];
                } else {
                  this.notificationService.error('', 'הפעולה נכשלה');
                }
              });
          }
        });
      }else {
        this.notificationService.error('', 'אין אפשרות לעדכן רשומה נעולה');
      }
    }
  }

  editPayments(item: any): void {
      if (item['status'] !== 'sent') {
        this.router.navigate(['platform', 'process' , 'edit-payments', item['id'] ]);
      }
  }

  isLockedBroadcast(): boolean {
    const items = this.dataTable.criteria.isCheckAll ? this.dataTable.items : this.dataTable.criteria.checkedItems;
    if (items.find(item => item['status'] === 'sent')) {
      return false;
    }
    return true;
  }

  getTitleError(errors): string {
    if (this.processDataService.activeProcess.incorrect) {
      return '';
    }
  }

  setColorError(errors , type): boolean {
    const error =  errors.defrayal_error.filter(e => type.includes(e.type));
    if (error.length > 0) {
       error.title = error.map(arr => {
        return this.defrayalError[arr.message.replace(/,/g, '').replace(/ /g, '_')];
      });
      errors.title = error.title[0];
      return true;
    }
    return false;
  }

  markValid(): void {
    if (this.checkedRowItems()) {
      if (this.isLockedBroadcast()) {
        const items = this.dataTable.criteria.checkedItems;
        this.monthlyTransferBlockService.markValid(items.map(item => item['id']), this.dataTable.criteria).
        then(response => {
          if (response['message'] === 'success') {
            this.notificationService.success('העידכון בוצע בהצלחה');
            if (this.dataTable.criteria.isCheckAll) {
              this.dataTable.criteria.isCheckAll = false;
            } else {
              this.dataTable.criteria.checkedItems = [];
            }
            this.fetchItems();
          } else {
            this.notificationService.error('אירעה שגיאה');
          }
        });
      } else {
        this.notificationService.error('', 'אין אפשרות לעדכן רשומה נעולה');
      }
    }
  }

  openDialogSendFileEmail(): void {
    if (this.checkedRowItems()) {
      this.dialog.open(SendEmailIncorrectComponent, {
        data: {
          processId: this.processDataService.activeProcess.processID,
          criteria: this.dataTable.criteria,
          files_list : this.dataTable.criteria.checkedItems.map(item => item['id']),
          employerId: this.selectUnitService.currentEmployerID
        },
        width: '550px',
        panelClass: 'send-email-dialog'
      });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.subscription.unsubscribe();
  }
}
