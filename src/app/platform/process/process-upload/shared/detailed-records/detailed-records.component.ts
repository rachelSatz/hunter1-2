import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { GroupTransferComponent } from './group-transfer/group-transfer.component';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { MonthlyTransferBlockService } from '../../../../../shared/_services/http/monthly-transfer-block';
import {ProcessDataService} from '../../../../../shared/_services/process-data-service';

@Component({
  selector: 'app-detailed-records',
  templateUrl: './detailed-records.component.html',
  styleUrls: ['../../../../../shared/data-table/data-table.component.css']
})
export class DetailedRecordsComponent  extends DataTableComponent implements OnInit , OnDestroy {

  readonly headers: DataTableHeader[] =  [
    { column: 'employee_name', label: 'שם העובד' }, { column: 'personal_id', label: 'תעודת זהות' },
    { column: 'deposit_type', label: 'סוג תקבול' }, { column: 'employer_product_code', label: 'מספר קופה בשכר' },
    { column: 'employer_product_name', label: 'שם קופה בשכר' }, { column: 'employer_product_type', label: 'סוג קופה' },
    { column: 'deposit_status', label: 'סטטוס' }, { column: 'prodect_code', label: 'מ"ה' },
    { column: 'payment_month', label: 'חודש תשלום' }, { column: 'payment_month', label: 'חודש ייחוס' },
    { column: 'salary', label: 'שכר' }, { column: 'sum_compensation', label: 'פיצויים' },
    { column: 'sum_employer_benefits', label: 'הפרשת מעסיק' }, { column: 'sum_employee_benefits', label: 'הפרשת עובד' }
  ];

  constructor(route: ActivatedRoute,
              private dialog: MatDialog,
              private processDataService: ProcessDataService,
              private  monthlyTransferBlockService: MonthlyTransferBlockService ) {
    super(route);
  }

  ngOnInit() {
    this.monthlyTransferBlockService.getMonthlyList(this.processDataService.activeProcess.processID)
      .then(response => this.setItems(response));
    super.ngOnInit();
  }

  openGroupTransferDialog(): void {
    if (true || this.checkedRowItems()) {
      const dialog = this.dialog.open(GroupTransferComponent, {
        data: {'ids': this.checkedItems.map(item => item.id)},
        width: '550px',
        panelClass: 'dialog-file'
      });
    }
  }

  checkedRowItems(): boolean {
    if (this.checkedItems.length === 0) {
      // this.setNoneCheckedWarning();
      return false;
    }
    return true;

  }

  openWarningMessageComponentDialog(type: string): void {
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
}
