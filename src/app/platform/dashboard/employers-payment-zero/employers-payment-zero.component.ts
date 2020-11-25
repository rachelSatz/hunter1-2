import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DatePipe } from '@angular/common';
import { InvoiceService } from '../../../shared/_services/http/invoice.service';

@Component({
  selector: 'app-employers-payment-zero',
  templateUrl: './employers-payment-zero.component.html',
  styleUrls: ['./employers-payment-zero.component.css']
})
export class EmployersPaymentZeroComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns  = [
    { name: 'name', label: 'שם מעסיק'},
    { name: 'identifier', label: 'ח.פ. מעסיק'},
    { name: 'ids_count', label: ' כמות ת.ז'},
    { name: 'sumn', label: 'סכום'},
  ];
  dataFilters: any;
  constructor(private dialogRef: MatDialogRef<EmployersPaymentZeroComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private datepipe: DatePipe,
              private InvoiceService: InvoiceService) { }

  ngOnInit() {
    console.log(this.data);
    if (this.data['from_date']) {
      this.dataFilters['from_date'] = this.data['from_date'];
      this.dataFilters['to_date'] = this.data['to_date'];
    } else {
      this.dataFilters['month'] = this.datepipe.transform(this.data['month'], 'yyyy-MM-dd');
    }
    if (this.data['project_id'] !== '0') {
      this.dataFilters['project_id'] = this.data['project_id'];
    }
    if (this.data['product_type'] !== 'all') {
      this.dataFilters['product_type'] = this.data['product_type'];
    }
    if (this.data['project_group_id']) {
      this.dataFilters['project_group_id'] = +this.data['project_group_id'];
    }
    if (this.data['organization_id'] !== 0 && this.data['organization_id'] !== '0' && this.data['organization_id']) {
      this.dataFilters['organization_id'] = +this.data['organization_id'];
    }
    if (this.data['employer_id'] !== 0 && this.data['employer_id'] !== '0' && this.data['employer_id']) {
      this.dataFilters['employer_id'] = +this.data['employer_id'];
    }
    this.fetchItems();
  }
  fetchItems(): void {
    if (this.dataTable) {
      this.dataTable.criteria.filters = this.data;
      this.dataTable.criteria.limit = 8;
      console.log(this.dataTable);
      this.InvoiceService.getZeroPaymentEmployers(this.dataTable.criteria)
        .then(response => { console.log(response);
          this.dataTable.setItems(response); });
    }
  }
}
