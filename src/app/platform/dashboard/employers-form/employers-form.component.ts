import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DatePipe } from '@angular/common';
import { EmployerService } from '../../../shared/_services/http/employer.service';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';

@Component({
  selector: 'app-employers-form',
  templateUrl: './employers-form.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css']
})
export class EmployersFormComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns = [
    {name: 'name', label: 'שם מעסיק'},
    {name: 'identifier', label: 'ח.פ. מעסיק'},
    {name: 'edit', label: 'עריכה'},
  ];
  payment_method: string;
  dataFilters: {};
  constructor(private dialogRef: MatDialogRef<EmployersFormComponent>,
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
      console.log(this.dataFilters);
      this.dataTable.criteria.limit = 8;
      this.EmployerService.getEmployersByPayment(this.dataTable.criteria)
        .then(response => { console.log(response);
          this.dataTable.setItems(response);
        });
    }
  }

  setFilters(): void {
    console.log(this.data['payment_method']);
    if (this.data['payment_method'] === 'direct_debit') {
      this.payment_method = 'הוראת קבע';
    }
    if (this.data['payment_method'] === 'bank_transfer,check') {
      this.payment_method = 'העברה בנקאית/ צק';
    }
    if (this.data['payment_method'] === 'credit_card') {
      this.payment_method = 'כרטיס אשראי';
    }
    if (this.data['payment_method'] === 'masav_product') {
      this.payment_method = 'מס"ב';
    }
    this.dataFilters['payment_method'] = this.data['payment_method'];
    if (this.data['project_id'] !== '0') {
      this.dataFilters['project_id'] = this.data['project_id'];
    }
    if (this.data['product_type'] !== 'all') {
      this.dataFilters['product_type'] = this.data['product_type'];
    }
    if (+this.data['organization_id'] !== 0 && this.data['organization_id']) {
      this.dataFilters['organization_id'] = +this.data['organization_id'];
    }
    if (+this.data['employer_id'] !== 0 && this.data['employer_id']) {
      this.dataFilters['employer_id'] = +this.data['employer_id'];
    }
  }


  openEmployerForm(emp_relation_id: number): void {
    console.log('maayan', emp_relation_id);
    this.dialogRef.close(emp_relation_id);
  }
}
