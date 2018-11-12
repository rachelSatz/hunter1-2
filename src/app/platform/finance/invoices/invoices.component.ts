import { Component, OnInit } from '@angular/core';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { ActivatedRoute } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material';
import { NotificationService } from 'app/shared/_services/notification.service';


@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css'],
  animations: [
    trigger('slideToggle', [
      state('inactive', style({
        display: 'none',
        height: '0',
        opacity: '0',
        visibility: 'hidden'
      })),
      state('active', style({
        display: '*',
        height: '*',
        opacity: '1',
        visibility: 'visible'
      })),
      transition('active => inactive', animate('200ms')),
      transition('inactive => active', animate('200ms'))
    ]),
    trigger('placeholder', [
      state('inactive', style({
        fontSize: '*',
        top: '*'
      })),
      state('active', style({
        fontSize: '10px',
        top: '-10px'
      })),
      transition('active => inactive', animate('300ms ease-in')),
      transition('inactive => active', animate('300ms ease-in'))
    ])
  ]
})
export class InvoicesComponent extends DataTableComponent implements OnInit {
  employers = [];
  departments = [];

  readonly headers: DataTableHeader[] =  [
    { column: 'employer_name', label: 'שם מעסיק' },
    { column: 'employer_name', label: 'מספר חשבונית בירוקה' },
    { column: 'employer_name', label: 'סכום' },
    { column: 'employer_name', label: 'כמות ת"ז' },
    { column: 'employer_name', label: 'בגין חודש' },
    { column: 'employer_name', label: 'ת.יצירה' },
    { column: 'employer_name', label: 'לתשלום עד' },
    { column: 'employer_name', label: 'סוג חשבונית' },
    { column: 'employer_name', label: 'סטטוס' },
    { column: 'employer_name', label: 'אפשרויות' }
  ];

  constructor(route: ActivatedRoute) {super(route); }

  ngOnInit() {
  }

}
