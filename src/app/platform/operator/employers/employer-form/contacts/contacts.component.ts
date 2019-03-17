import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { EntityTypes } from 'app/shared/_models/contact.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['../../../../../shared/data-table/data-table.component.css']
})
export class ContactsComponent extends DataTableComponent implements OnInit , OnDestroy {

  sub = new Subscription;

  pathEmployers = false;
  entity_types = EntityTypes;
  location: string;

  constructor(route: ActivatedRoute,
              private contactService: ContactService,
              private router: Router,
              private selectUnit: SelectUnitService) {
    super(route);
  }

  readonly headers: DataTableHeader[] =  [
    { column: 'organization_name', label: 'ארגון' },
    { column: 'employer_name', label: 'מעסיק' },
    { column: 'type', label: 'סוג גורם' },
    { column: 'name', label: 'שם מלא' },
    { column: 'phone', label: 'טלפון' },
    { column: 'mobile', label: 'טלפון נייד' },
    { column: 'email', label: 'כתובת מייל' },
    { column: 'comment', label: 'הערות' }
  ];


  ngOnInit() {
    if (this.router.url.includes( 'employers')) {
        this.pathEmployers = true;
        this.location = 'employers';
        this.paginationData.limit = 4;
    } else if (this.router.url.includes( 'operator')) {
      this.location = 'operator';
    } else {
        this.location = 'settings';
    }

    this.sub.add(this.selectUnit.unitSubject.subscribe(() => this.fetchItems()));

    super.ngOnInit();
  }

  fetchItems() {
    this.contactService.getContacts(this.selectUnit.currentOrganizationID,
      this.selectUnit.currentEmployerID,
      this.location)
      .then(response => this.setItems(response));
  }
  //
  // aaa(item: any) {
  //   // this.selectUnit.currentEmployerID
  //   this.selectUnit.currentEmployerID = item.employer_id;
  //   this.router.navigate(['./', 'form', item.id]);
  //   // [routerLink]="['./', 'form']"
  // }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.sub.unsubscribe();
  }

}
