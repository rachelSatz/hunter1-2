import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { MatDialog } from '@angular/material';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { EmployerStatus } from 'app/shared/_models/employer.model';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-employers',
  templateUrl: './employers.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', './employers.component.css'],
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
export class EmployersComponent extends DataTableComponent  implements OnInit , OnDestroy {

  sub = new Subscription;
  extraSearchCriteria = 'inactive';
  employerStatus = EmployerStatus;

  readonly headers: DataTableHeader[] =  [
    { column: 'organization_name', label: 'ארגון' },
    { column: 'employer_name', label: 'מעסיק' },
    { column: 'entity_number', label: 'מספר ח"פ' },
    { column: 'email', label: 'כתובת מייל' },
    { column: 'phone', label: 'טלפון' },
    { column: 'mobile', label: 'טלפון נייד' },
    { column: 'address', label: 'כתובת' },
    { column: 'status', label: 'סטטוס' }

  ];

  constructor(route: ActivatedRoute,
              private employerService: EmployerService) {
    super(route);
    this.paginationData.limit = 12;
  }

  ngOnInit() {
    this.fetchItems();
    super.ngOnInit();
  }

  fetchItems(): void {
    this.employerService.getAllEmployers(this.searchCriteria).then(response => this.setItems(response));
  }

  toggleExtraSearch() {
   if (this.extraSearchCriteria === 'active') {
     this.extraSearchCriteria = 'inactive';
   } else {
        this.extraSearchCriteria = 'active';
   }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
