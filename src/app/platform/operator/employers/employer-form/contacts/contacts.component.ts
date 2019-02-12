import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { EntityTypes } from 'app/shared/_models/contact.model';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
  styles: ['.row-image { width: 30px; height: auto; }' ]
})
export class ContactsComponent extends DataTableComponent implements OnInit , OnDestroy {

  constructor(route: ActivatedRoute,
              private contactService: ContactService,
              private selectUnit: SelectUnitService) {
    super(route);
    this.paginationData.limit = 5;
  }

  types = EntityTypes;
  readonly headers: DataTableHeader[] =  [
    { column: 'type', label: 'סוג גורם' },
    { column: 'name', label: 'שם מלא' },
    { column: 'phone', label: 'טלפון' },
    { column: 'mobile', label: 'טלפון נייד' },
    { column: 'email', label: 'כתובת מייל' },
    { column: 'comment', label: 'הערות' }
  ];


  ngOnInit() {
    this.contactService.getContacts(0, this.selectUnit.currentEmployerID)
      .then(response => this.setItems(response));
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
