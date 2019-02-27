import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { ContactService } from 'app/shared/_services/http/contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['../../../../../shared/data-table/data-table.component.css']
})
export class ContactsComponent extends DataTableComponent implements OnInit , OnDestroy {

  pathEmployers = false;

  constructor(route: ActivatedRoute,
              private contactService: ContactService,
              private router: Router,
              private selectUnit: SelectUnitService) {
    super(route);
    if (this.router.url.includes( 'operator')) {
      this.paginationData.limit = 5;
    }
  }

  readonly headers: DataTableHeader[] =  [
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
    }
    this.contactService.getContacts(0, this.selectUnit.currentEmployerID)
      .then(response => this.setItems(response));
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
