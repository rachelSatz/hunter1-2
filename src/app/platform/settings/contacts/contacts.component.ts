import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';

import { ContactService } from 'app/shared/_services/http/contact.service';

import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { EntityTypes } from 'app/shared/_models/contact.model';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css']
})
export class ContactsComponent extends DataTableComponent {

  types = EntityTypes;

  readonly headers: DataTableHeader[] =  [
    { column: 'entity_name', label: 'שם גורם' }, { column: 'type', label: 'סוג גורם' },
    { column: 'first_name', label: 'שם פרטי' }, { column: 'last_name', label: 'שם משפחה' },
    { column: 'phone', label: 'טלפון' }, { column: 'mobile', label: 'נייד' },
    { column: 'email', label: 'כתובת מייל' }, { column: 'role', label: 'תפקיד' }
  ];

  constructor(route: ActivatedRoute, private contactService: ContactService) {
    super(route);
  }

  fetchItems(): void {
    this.contactService.getContacts().then(response => this.setItems(response));
  }
}
