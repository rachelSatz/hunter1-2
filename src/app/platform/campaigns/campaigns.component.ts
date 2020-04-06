import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableComponent} from '../../shared/data-table/data-table.component';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns =  [
    { name: 'organization_name', label: 'שם הקמפיין', searchable: false },
    { name: 'employer_name', label: 'תאריך שליחה' , searchable: false},
    { name: 'entity_number', label: 'שעת יצירה' , searchable: false},
    { name: 'email', label: 'כמות נשלח' , searchable: false},
  ];
  constructor() { }

  ngOnInit() {
  }

  fetchItems() {}
}
