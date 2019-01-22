import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { GroupTransferComponent } from './group-transfer/group-transfer.component';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { Subscription } from 'rxjs';
import { GroupBankAccountComponent } from './group-bank-account/group-bank-account.component';
import { ProductType } from 'app/shared/_models/product.model';
import { DepositStatus, DepositType } from 'app/shared/_models/monthly-transfer-block';


@Component({
  selector: 'app-detailed-records',
  templateUrl: './detailed-records.component.html',
  styles: ['#accounts { direction: ltr; height: 200px;  overflow-y: auto; }',
           '.extend {width: 140%; margin-right: -20%}'],
  styleUrls: ['../../../../../shared/data-table/data-table.component.css']
})
export class DetailedRecordsComponent  extends DataTableComponent implements OnInit , OnDestroy {

  readonly headers: DataTableHeader[] =  [
    { column: 'employee_name', label: 'שם העובד' }, { column: 'personal_id', label: 'תעודת זהות' },
    { column: 'deposit_type', label: 'סוג תקבול' }, { column: 'employer_product_code', label: 'מספר קופה בשכר' },
    { column: 'employer_product_name', label: 'שם קופה בשכר' }, { column: 'employer_product_type', label: 'סוג קופה' },
    { column: 'deposit_status', label: 'סטטוס' }, { column: 'prodect_code', label: 'מ"ה' },
    { column: 'payment_month', label: 'חודש תשלום' }, { column: 'payment_month1', label: 'חודש ייחוס' },
    { column: 'salary', label: 'שכר' }, { column: 'sum_compensation', label: 'פיצויים' },
    { column: 'sum_employer_benefits', label: 'הפרשת מעסיק' }, { column: 'sum_employee_benefits', label: 'הפרשת עובד' }
  ];

  constructor(route: ActivatedRoute,
              private dialog: MatDialog,
              private processDataService: ProcessDataService,
              private  monthlyTransferBlockService: MonthlyTransferBlockService ,
              protected  notificationService: NotificationService) {
  super(route , notificationService);
}
  employees = [];
  products = [];
  sub = new Subscription;

  productTypes = ProductType;
  depositStatus = DepositStatus;
  depositTypes = DepositType

  ngOnInit() {
    this.monthlyTransferBlockService.getEntity(this.processDataService.activeProcess.processID)
      .then(response => {
        this.employees = response['employees'];
        this.products = response['products'];
      });

    this.fetchItems();
    super.ngOnInit();
  }

  fetchItems() {
    this.searchCriteria['processId'] = this.processDataService.activeProcess.processID;
    this.monthlyTransferBlockService.getMonthlyList(this.searchCriteria)
      .then(response => this.setItems(response));
  }

  openGroupTransferDialog(): void {
    if (this.checkedRowItems()) {
      this.monthlyTransferBlockService.groupList( this.processDataService.activeProcess.processID).then(items => {
        const ids = this.checkedItems.map(item => item.id);
        const dialog = this.dialog.open(GroupTransferComponent, {
          data: {'ids': ids
            , 'groups': items, 'processId': this.processDataService.activeProcess.processID},
          width: '550px',
          panelClass: 'dialog-file'
        });
        this.sub.add(dialog.afterClosed().subscribe((data) => {
          this.checkedItems = [];
          this.isCheckAll = false;
          if (data && data !== null && data !== '') {
            this.openBankAccountDialog(data, ids);
            this.fetchItems();
          }else {
            this.fetchItems();
          }
        }));
      });
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
    if (this.checkedItems.length === 0) {
      this.setNoneCheckedWarning();
      return false;
    }
    return true;
  }

  openWarningMessageComponentDialog(type: boolean): void {
    const title = type ? 'לא רלונטי' : 'מחיקת שורות';
    const body = type ? 'האם ברצונך להפוך שורת אלו ללא רלונטית?' : 'האם ברצונך למחוק שורת אלו?';
    const typeData = type ? 'notRelevant' : 'delete';
    if (this.checkedRowItems()) {

      const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};

      this.notificationService.warning( title, body, buttons).then(confirmation => {
        if (confirmation.value) {
          this.monthlyTransferBlockService.update( typeData, '' , this.checkedItems.map(item => item.id))
            .then( response => {
              if (response) {
                this.checkedItems = [];
                this.isCheckAll = false;
                this.fetchItems();
              } else {
                this.notificationService.error( '', 'הפעולה נכשלה');
              }
            });
        }
      });
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.sub.unsubscribe();
  }
}
