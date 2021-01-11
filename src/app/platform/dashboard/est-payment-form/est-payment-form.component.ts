import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DatePipe } from '@angular/common';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { EmployerService } from '../../../shared/_services/http/employer.service';

@Component({
  selector: 'app-est-payment-form',
  templateUrl: './est-payment-form.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css']
})
export class EstPaymentFormComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns  = [
    { name: 'name', label: 'שם מעסיק'},
    { name: 'identifier', label: 'ח.פ. מעסיק'},
    { name: 'est_payment_amount', label: ' סכום'},
  ];
  dataFilters: any;
  constructor(private dialogRef: MatDialogRef<EstPaymentFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private datepipe: DatePipe,
              private EmployerService: EmployerService) {
    this.dataFilters = {};
  }


  ngOnInit() {
    this.fetchItems();
  }

  fetchItems(): void {
    if (this.dataTable) {
      this.setFilters();
      this.dataTable.criteria.filters = this.dataFilters;
      this.dataTable.criteria.limit = 8;
      this.EmployerService.getEmployersWithEstPayment(this.dataTable.criteria)
        .then(response => {
          this.dataTable.setItems(response); });
    }
  }

  setFilters(): void {
    this.dataFilters['from_date'] = this.data['from_date'];
    this.dataFilters['to_date'] = this.data['to_date'];
    if (this.data['project_id'] !== '0') {
      this.dataFilters['project_id'] = this.data['project_id'];
    }
    if (this.data['product_type'] !== 'all') {
      this.dataFilters['product_type'] = this.data['product_type'];
    }
    if (+this.data['organization_id'] !== 0  && this.data['organization_id']) {
      this.dataFilters['organization_id'] = +this.data['organization_id'];
    }
    if (+this.data['employer_id'] !== 0 && this.data['employer_id']) {
      this.dataFilters['employer_id'] = +this.data['employer_id'];
    }
  }
}
