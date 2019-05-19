import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';
import {DepositStatus, DepositType, EmployeeStatus} from 'app/shared/_models/monthly-transfer-block';
import { DataTableResponse } from 'app/shared/data-table/classes/data-table-response';
import { GroupTransferComponent } from '../group-transfer/group-transfer.component';
import { EditPaymentsComponent } from './edit-payments/edit-payments.component';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
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
  nameEmployeeName = 'employee_id';

  readonly columns =  [
    { name: this.nameEmployeeName , sortName: 'employee_chr__employee__first_name', label: 'שם העובד' , searchOptions: { labels: [] }},
    { name: 'personal_id',  sortName: 'employee_chr__employee__identifier', label: 'תעודת זהות' , searchable: false },
    { name: 'deposit_type', label: 'סוג תקבול' , searchable: false },
    { name: this.nameEmployerProductCode , sortName: 'employer_product__code', label: 'מספר קופה בשכר',
      subLabel: 'שם קופה', searchOptions: { labels: [] } },
    { name: 'employer_product_name', sortName: 'employer_product__code', label: 'שם קופה בשכר' , searchable: false },
    { name: 'employer_product_type', sortName: 'employer_product__type', label: 'סוג קופה' , searchable: false },
    { name: 'deposit_status', isSort: false , label: 'מעמד' , searchable: false },
    { name: 'employee_status', isSort: false , label: 'סטטוס' , searchable: false },
    { name: 'product_code', sortName: 'employer_product__product__code', label: 'מ"ה' , searchable: false },
    { name: 'payment_month', label: 'חודש תשלום' , searchable: false },
    { name: 'payment_month1', isSort: false, label: 'חודש ייחוס' , searchable: false },
    { name: 'salary', label: 'שכר' , searchable: false},
    { name: 'sum_compensation', isSort: false, label: 'פיצויים' , searchable: false },
    { name: 'sum_employer_benefits', isSort: false, label: 'הפרשת מעסיק' , searchable: false },
    { name: 'sum_employee_benefits', isSort: false, label:  'הפרשת עובד' , searchable: false } ,
    { name: 'amount', isSort: false, label: 'סה"כ' , searchable: false }
  ];

  constructor(public route: ActivatedRoute,
              private dialog: MatDialog,
              private processDataService: ProcessDataService,
              private  monthlyTransferBlockService: MonthlyTransferBlockService ,
              protected  notificationService: NotificationService,
              private selectUnitService: SelectUnitService) { }
  sub = new Subscription;

  depositStatus = DepositStatus;
  employeeStatus = EmployeeStatus;
  depositTypes = DepositType;
  productType = ProductType;
  records_id = 0;

  ngOnInit() {
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
      });
  }

  fetchItems() {
    if (this.items.length <= 0) {
      this.dataTable.criteria.filters['processId'] = this.processDataService.activeProcess.processID;
      if (this.records_id !== 0) {
        this.dataTable.criteria.filters['recordsId'] = this.records_id;
      }
      this.monthlyTransferBlockService.getMonthlyList(this.dataTable.criteria)
        .then(response => {
          this.dataTable.setItems(response);
        });
    } else {
      const data = new DataTableResponse();
      data.items = this.items;
      data.lastPage = 1;
      data.total = this.items.length;
      this.dataTable.setItems(data);
    }
  }

  openGroupTransferDialog(): void {
    if (this.checkedRowItems()) {
      if (this.isLockedBroadcast()) {
          const ids = this.dataTable.criteria.checkedItems.map(item => item['id']);
          const dialog = this.dialog.open(GroupTransferComponent, {
            data: { 'ids': ids,
              'processId': this.processDataService.activeProcess.processID, 'type': 'mtb'
            },
            width: '800px',
            panelClass: 'dialog-file'
          });
          this.sub.add(dialog.afterClosed().subscribe(() => {
            this.fetchItems();
          }));
      }else {
        this.notificationService.error('', 'אין אפשרות לעדכן רשומה נעולה');
      }
    }
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
            this.monthlyTransferBlockService.update(typeData, '',
              this.dataTable.criteria.checkedItems.map(item => item['id']))
              .then(response => {
                if (response) {
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

  editPayments(): void {
    if (this.checkedRowItems()) {
      if (this.isLockedBroadcast()) {
        const dialog = this.dialog.open(EditPaymentsComponent, {
          data: { 'ids':  this.dataTable.criteria.checkedItems,
            'processId': this.processDataService.activeProcess.processID
          },
          width: '100%',
          maxWidth: '100%',
          panelClass: 'edit-payments'
        });
        this.sub.add(dialog.afterClosed().subscribe(() => {
          this.items = [];
          this.fetchItems();
        }));
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
