import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DatePipe } from '@angular/common';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { EmployerService } from '../../../shared/_services/http/employer.service';


@Component({
  selector: 'app-other-payer-popup',
  templateUrl: './other-payer-popup.component.html',
  styleUrls: ['./other-payer-popup.component.css'],

})
export class OtherPayerPopupComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns  = [
    { name: 'name_payer', label: 'מעסיק משלם'},
    { name: 'identifier_payer', label: 'ח.פ. מעסיק משלם'},
    { name: 'name_get', label: 'מעסיק מקבל'},
    { name: 'identifier_get', label: 'ח.פ. מעסיק מקבל'}
  ];
  dataFilters: any;
  constructor(private dialogRef: MatDialogRef<OtherPayerPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private datepipe: DatePipe,
              private EmployerService: EmployerService)  { }

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
      this.EmployerService.getEmployersPayedByOther(this.dataTable.criteria)
        .then(response => { console.log(response);
          this.dataTable.setItems(response); });
    }
  }
}
