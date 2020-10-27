import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DatePipe} from '@angular/common';
import {DataTableComponent} from "../../../shared/data-table/data-table.component";
import {EmployerService} from '../../../shared/_services/http/employer.service';


@Component({
  selector: 'app-other-payer-popup',
  templateUrl: './other-payer-popup.component.html',
  styleUrls: ['./other-payer-popup.component.css'],

})
export class OtherPayerPopupComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;getPayedByOtherEmployers

  readonly columns  = [
    { name: 'name', label: 'שם מעסיק משלם'},
    { name: 'identifier', label: 'ח.פ. מעסיק משלם'},
    { name: 'name', label: 'שם מעסיק'},
    { name: 'identifier', label: 'ח.פ. מעסיק'}

  ];


  constructor(private dialogRef: MatDialogRef<OtherPayerPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private datepipe: DatePipe,
              private EmployerService: EmployerService)  { }

  ngOnInit() {
    console.log(this.data);
    if(this.data['from_date']){
      this.data['from_date'] = this.datepipe.transform(this.data['from_date'], 'yyyy-MM-dd');
      this.data['to_date'] = this.datepipe.transform(this.data['to_date'], 'yyyy-MM-dd');
    } else{
      this.data['month'] = this.datepipe.transform(this.data['month'], 'yyyy-MM-dd');
    }
    this.fetchItems();

  }

  fetchItems(): void {
    if(this.dataTable){
      this.dataTable.criteria.filters = this.data;
      this.dataTable.criteria.limit = 8;
      console.log(this.dataTable);
      this.EmployerService.getEmployersWithEstPayment(this.dataTable.criteria)
        .then(response =>{ console.log(response);
          this.dataTable.setItems(response);})
    }

  }

}
