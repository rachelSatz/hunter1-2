import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {DataTableComponent} from '../../../shared/data-table/data-table.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DatePipe} from '@angular/common';
import {InvoiceService} from '../../../shared/_services/http/invoice.service';

@Component({
  selector: 'app-manually-charged-employers',
  templateUrl: './manually-charged-employers.component.html',
  styleUrls: ['./manually-charged-employers.component.css']
})
export class ManuallyChargedEmployersComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns  = [
    { name: 'name', label: 'שם מעסיק'},
    { name: 'identifier', label: 'ח.פ. מעסיק'},
    { name: 'ids_count', label: ' כמות ת.ז'},
    { name: 'sumn', label: 'סכום'},
  ];

  constructor(private dialogRef: MatDialogRef<ManuallyChargedEmployersComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private datepipe: DatePipe,
              private InvoiceService: InvoiceService) { }

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
      this.InvoiceService.getManuallyChargedEmployers(this.dataTable.criteria)
        .then(response =>{ console.log(response);
          this.dataTable.setItems(response);})
    }
  }
}
