import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DatePipe} from '@angular/common';
import {EmployerService} from '../../../shared/_services/http/employer.service';
import {DataTableComponent} from '../../../shared/data-table/data-table.component';

@Component({
  selector: 'app-employers-form',
  templateUrl: './employers-form.component.html',
  styleUrls: ['./employers-form.component.css', '../../../shared/data-table/data-table.component.css']
})
export class EmployersFormComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns = [
    {name: 'name', label: 'שם מעסיק'},
    {name: 'identifier', label: 'ח.פ. מעסיק'},
    {name: 'edit', label: 'עריכה'},
  ];
  payment_method: string;
  constructor(private dialogRef: MatDialogRef<EmployersFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private datepipe: DatePipe,
              private EmployerService: EmployerService) {
  }

  ngOnInit() {
    console.log(this.data);
    if(this.data['payment_method']=='direct_debit')
      this.payment_method = 'הוראת קבע';
    if(this.data['payment_method']=='bank_transfer')
      this.payment_method = 'העברה בנקאית/ צק';
    if(this.data['payment_method']=='credit_card')
      this.payment_method = 'כרטיס אשראי';
    if(this.data['payment_method']=='masav_product')
      this.payment_method = 'מס"ב';
    this.fetchItems();

  }

  fetchItems(): void {
    if (this.dataTable) {
      this.dataTable.criteria.filters = this.data;
      this.dataTable.criteria.limit = 8;
      console.log(this.dataTable);
      this.EmployerService.getEmployersByPayment(this.dataTable.criteria)
        .then(response => {
          console.log(response);
          this.dataTable.setItems(response);
        })
    }

  }
  openEmployerForm(employer_id: number): void{
    console.log(employer_id)
  }
}
