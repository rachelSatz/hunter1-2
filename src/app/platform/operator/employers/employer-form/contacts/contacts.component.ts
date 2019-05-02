import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { EntityTypes } from 'app/shared/_models/contact.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['../../../../../shared/data-table/data-table.component.css'],
})
export class ContactsComponent implements OnInit , OnDestroy {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  sub = new Subscription;

  pathEmployers = false;
  entity_types = EntityTypes;
  location: string;

  constructor(public route: ActivatedRoute,
              private contactService: ContactService,
              private router: Router,
              private selectUnit: SelectUnitService) {
  }

  readonly columns =  [
    { name: 'organization_name', label: 'ארגון' , searchable: false},
    { name: 'employer_name', label: 'מעסיק' , searchable: false},
    { name: 'type', label: 'סוג גורם' , searchable: false},
    { name: 'name', label: 'שם מלא' , searchable: false},
    { name: 'phone', label: 'טלפון' , searchable: false},
    { name: 'mobile', label: 'טלפון נייד' , searchable: false},
    { name: 'email', label: 'כתובת מייל' , searchable: false},
    { name: 'comment', label: 'הערות' , searchable: false}
  ];

  ngOnInit() {
    if (this.router.url.includes( 'employers')) {
        this.location = 'employers';
        this.dataTable.criteria.limit = 5;
    } else if (this.router.url.includes( 'operator')) {
      this.pathEmployers = true;
      this.location = 'operator';
    } else {
        this.location = 'settings';
    }
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
        this.dataTable.paginationData.currentPage = 1;
        this.dataTable.criteria.page = 1;
        this.fetchItems();
      }
    ));
  }


  fetchItems() {
    const organizationId = this.selectUnit.currentOrganizationID;
    const employerId = this.selectUnit.currentEmployerID;

    if (employerId) {
      this.dataTable.criteria.filters['employerId'] = employerId;
    } else {
      this.dataTable.criteria.filters['organizationId'] = organizationId;
    }
    this.dataTable.criteria.filters['location'] = this.location;
    this.contactService.getContacts(this.dataTable.criteria)
      .then(response => {
        this.setResponse(response);
      });
  }
  setResponse(response: any): void {
    this.dataTable.setItems(response);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
