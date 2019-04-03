import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';
import { DepositStatus, DepositType } from 'app/shared/_models/monthly-transfer-block';
import { DataTableComponent } from 'app/shared/data-table-1/data-table.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { ProductType } from 'app/shared/_models/product.model';

import { GroupBankAccountComponent } from './group-bank-account/group-bank-account.component';
import { GroupTransferComponent } from './group-transfer/group-transfer.component';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detailed-records',
  templateUrl: './detailed-records.component.html',
  styleUrls: ['./detailed-records.component.css']
})
export class DetailedRecordsComponent implements OnInit , OnDestroy {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  nameEmployerProductCode = 'employer_product_code';
  nameEmployeeName = 'employee_name';

  readonly columns =  [
    { name: this.nameEmployeeName , sortName: 'employee_chr__employee__first_name', label: 'שם העובד' , searchOptions: { labels: [] }},
    { name: 'personal_id',  sortName: 'employee_chr__employee__identifier', label: 'תעודת זהות' , searchable: false },
    { name: 'deposit_type', label: 'סוג תקבול' , searchable: false },
    { name: this.nameEmployerProductCode , sortName: 'employer_product__code', label: 'מספר קופה בשכר',
      subLabel: 'שם קופה', searchOptions: { labels: [] } },
    { name: 'employer_product_name', sortName: 'employer_product__code', label: 'שם קופה בשכר' , searchable: false },
    { name: 'employer_product_type', sortName: 'employer_product__type', label: 'סוג קופה' , searchable: false },
    { name: 'deposit_status', isSort: false , label: 'סטטוס' , searchable: false },
    { name: 'product_code', sortName: 'employer_product__product__code', label: 'מ"ה' , searchable: false },
    { name: 'payment_month', label: 'חודש תשלום' , searchable: false },
    { name: 'payment_month1', isSort: false, label: 'חודש ייחוס' , searchable: false },
    { name: 'salary', label: 'שכר' , searchable: false},
    { name: 'sum_compensation', isSort: false, label: 'פיצויים' , searchable: false },
    { name: 'sum_employer_benefits', isSort: false, label: 'הפרשת מעסיק' , searchable: false },
    { name: 'sum_employee_benefits', isSort: false, label:  'הפרשת עובד' , searchable: false } ,
    { name: 'amount', isSort: false, label: 'סה"כ' , searchable: false }
  ];

  constructor(route: ActivatedRoute,
              private dialog: MatDialog,
              private processDataService: ProcessDataService,
              private  monthlyTransferBlockService: MonthlyTransferBlockService ,
              protected  notificationService: NotificationService) { }
  sub = new Subscription;

  depositStatus = DepositStatus;
  depositTypes = DepositType;
  productType = ProductType;

  ngOnInit() {
    this.monthlyTransferBlockService.getEntity(this.processDataService.activeProcess.processID)
      .then(response => {
        let column = this.dataTable.searchColumn(this.nameEmployeeName);
        column['searchOptions'].labels = response['employees'];
        column = this.dataTable.searchColumn(this.nameEmployerProductCode);
        column['searchOptions'].labels = response['products'];
      });
  }

  fetchItems() {
    this.dataTable.criteria.filters['processId'] = this.processDataService.activeProcess.processID;
    this.monthlyTransferBlockService.getMonthlyList(this.dataTable.criteria)
      .then(response => this.dataTable.setItems(response));
  }


  openGroupTransferDialog(): void {
    if (this.checkedRowItems()) {
      if (this.isLockedBroadcast()) {
        this.monthlyTransferBlockService.groupList(this.processDataService.activeProcess.processID).then(items => {
          const ids = this.dataTable.criteria.checkedItems.map(item => item['id']);
          const dialog = this.dialog.open(GroupTransferComponent, {
            data: {
              'ids': ids
              , 'groups': items, 'processId': this.processDataService.activeProcess.processID
            },
            width: '550px',
            panelClass: 'dialog-file'
          });
          this.sub.add(dialog.afterClosed().subscribe((data) => {
            // this.checkedItems = [];
            // this.isCheckAll = false;
            if (data && data !== null && data !== '') {
              this.openBankAccountDialog(data, ids);
              this.fetchItems();
            } else {
              this.fetchItems();
            }
          }));
        });
      }else {
        this.notificationService.error('', 'אין אפשרות לעדכן רשומה נעולה');
      }
    }
  }
  openBankAccountDialog(data: object, ids: object): void {
    this.dialog.open(GroupBankAccountComponent, {
      data: {'banks': data, 'ids': ids },
      width: '655px',
      panelClass: 'dialog-file'
    });
  }

  checkedRowItems(): boolean {
    if (this.dataTable.criteria.checkedItems.length === 0) {
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

        this.notificationService.warning(title, body, buttons).then(confirmation => {
          if (confirmation.value) {
            this.monthlyTransferBlockService.update(typeData, '', this.dataTable.criteria.checkedItems.map(item => item['id']))
              .then(response => {
                if (response) {
                  // this.checkedItems = [];
                  // this.isCheckAll = false;
                  this.fetchItems();
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

  isLockedBroadcast(): boolean {
    if (this.dataTable.criteria.checkedItems.find(item => item['status'] === 'sent')) {
      return false;
    }
    return true;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
