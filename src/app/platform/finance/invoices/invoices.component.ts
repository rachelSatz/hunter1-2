import { Component, OnInit } from '@angular/core';
import {DataTableComponent} from '../../../shared/data-table/data-table.component';
import {DataTableHeader} from '../../../shared/data-table/classes/data-table-header';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent extends DataTableComponent implements OnInit {

  readonly headers: DataTableHeader[] =  [
    { column: 'employer_name', label: 'שם מעסיק' },
    { column: 'employer_name', label: 'שם מעסיק' },
    { column: 'employer_name', label: 'שם מעסיק' },
    { column: 'employer_name', label: 'שם מעסיק' },
    { column: 'employer_name', label: 'שם מעסיק' },
    { column: 'employer_name', label: 'שם מעסיק' },
    { column: 'employer_name', label: 'שם מעסיק' },
    { column: 'employer_name', label: 'שם מעסיק' }
  ];

  constructor(route: ActivatedRoute) {super(route); }

  ngOnInit() {
  }

}
