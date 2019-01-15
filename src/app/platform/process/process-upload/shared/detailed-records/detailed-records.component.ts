import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { GroupTransferComponent } from './group-transfer/group-transfer.component';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';

@Component({
  selector: 'app-detailed-records',
  templateUrl: './detailed-records.component.html',
  styleUrls: ['../../../../../shared/data-table/data-table.component.css']
})
export class DetailedRecordsComponent  extends DataTableComponent implements OnInit , OnDestroy {

  readonly headers: DataTableHeader[] =  [
    { column: 'process_name', label: 'שם העובד' }, { column: 'process_number', label: 'תעודת זהות' },
    { column: 'type', label: 'סוג תקבול' }, { column: 'month', label: 'מספר קופה בשכר' },
    { column: 'amount', label: 'שם קופה בשכר' }, { column: 'status', label: 'סוג קופה' },
    { column: 'download', label: 'סטטוס' }, { column: 'download', label: 'מ"ה' },
    { column: 'download', label: 'חודש תשלום' }, { column: 'download', label: 'חודש ייחוס' },
    { column: 'download', label: 'שכר' }, { column: 'download', label: 'פיצויים' },
    { column: 'download', label: 'הפרשת מעסיק' }, { column: 'download', label: 'הפרשת עובד' },
    { column: 'download', label: 'סה"כ' }
  ];

  constructor(route: ActivatedRoute,
              private dialog: MatDialog) {
    super(route);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  openGroupTransferDialog(): void {
    if (this.checkedRowItems()) {
      const dialog = this.dialog.open(GroupTransferComponent, {
        data: {'file_id': this.checkedItems.map(item => item.file_id)},
        width: '550px',
        panelClass: 'dialog-file'
      });
    }
  }

  checkedRowItems(): boolean {
    if (this.checkedItems.length === 0) {
      this.setNoneCheckedWarning();
      return false;
    }
    return true;

  }
}
