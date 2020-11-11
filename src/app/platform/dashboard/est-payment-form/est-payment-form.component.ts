import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DatePipe } from '@angular/common';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { EmployerService } from '../../../shared/_services/http/employer.service';

@Component({
  selector: 'app-est-payment-form',
  templateUrl: './est-payment-form.component.html',
  styleUrls: ['./est-payment-form.component.css', '../../../shared/data-table/data-table.component.css']
})
export class EstPaymentFormComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns  = [
    { name: 'name', label: 'שם מעסיק'},
    { name: 'identifier', label: 'ח.פ. מעסיק'},
    { name: 'est_payment_amount', label: ' סכום'},
  ];

  constructor(private dialogRef: MatDialogRef<EstPaymentFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private datepipe: DatePipe,
              private EmployerService: EmployerService) { }

  ngOnInit() {
    if (this.data['from_date']) {
      this.data['from_date'] = this.datepipe.transform(this.data['from_date'], 'yyyy-MM-dd');
      this.data['to_date'] = this.datepipe.transform(this.data['to_date'], 'yyyy-MM-dd');
    } else {
      this.data['month'] = this.datepipe.transform(this.data['month'], 'yyyy-MM-dd');
    }
    this.fetchItems();

  }

  fetchItems(): void {
    if(this.dataTable) {
      this.dataTable.criteria.filters = this.data;
      this.dataTable.criteria.limit = 8;
      console.log(this.dataTable);
      this.EmployerService.getEmployersWithEstPayment(this.dataTable.criteria)
        .then(response => {
          this.dataTable.setItems(response); });
    }

  }
}
