import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DataTableResponse } from 'app/shared/data-table/classes/data-table-response';

@Component({
  selector: 'app-group-history',
  templateUrl: './group-history.component.html',
  styles: ['.height500 { height: 500px; }'],
})
export class GroupHistoryComponent implements OnInit {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;


  constructor(  @Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<GroupHistoryComponent>,
                private helpers: HelpersService,
                private monthlyService: MonthlyTransferBlockService) { }

  readonly columns  = [
    { name: 'employee_name', label: 'שם עובד' , searchable: false },
    { name: 'product', label: 'מ"ה מקורי', searchable: false},
    { name: 'employee_product', label: 'קופה בשכר מקורי' , searchable: false },
    { name: 'product', label: 'מ"ה עכשווי', searchable: false},
    { name: 'employee_name', label: 'קופה בשכר עכשווי' , searchable: false }];

  ngOnInit() {
    const data = new DataTableResponse(this.data.items,  this.data.items.length, 1);
    this.dataTable.setItems(data);
  }

  // fetchItems() {
  //
  // }

  submit(): void {
    this.helpers.setPageSpinner(true);
    this.monthlyService.changeGroupByHistory(this.data.processId , this.data.items).then(
      res => {
        this.helpers.setPageSpinner(false);
        this.dialogRef.close(); });
  }

}
