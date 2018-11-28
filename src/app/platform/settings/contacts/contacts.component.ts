import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';

import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { EntityTypes } from 'app/shared/_models/contact.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css']
})
export class ContactsComponent extends DataTableComponent implements OnInit, OnDestroy  {

  types = EntityTypes;
  selectUnitSubscription: Subscription;

  readonly headers: DataTableHeader[] =  [
    { column: 'entity_name', label: 'שם גורם' }, { column: 'type', label: 'סוג גורם' },
    { column: 'first_name', label: 'שם פרטי' }, { column: 'last_name', label: 'שם משפחה' },
    { column: 'phone', label: 'טלפון' }, { column: 'mobile', label: 'נייד' },
    { column: 'email', label: 'כתובת מייל' }, { column: 'role', label: 'תפקיד' }
  ];

  constructor(route: ActivatedRoute, private contactService: ContactService, private selectUnit: SelectUnitService) {
    super(route);
  }

  ngOnInit() {
    this.selectUnitSubscription = this.selectUnit.unitSubject.subscribe(() => this.fetchItems());
    super.ngOnInit();
  }

  fetchItems(): void {
    this.contactService.getContacts(this.selectUnit.currentOrganizationID, this.selectUnit.currentEmployerID)
      .then(response => this.setItems(response));
  }

  ngOnDestroy() {

    if (this.selectUnitSubscription) {
      this.selectUnitSubscription.unsubscribe();
    }
  }
}
