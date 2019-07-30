import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { EntityTypes } from 'app/shared/_models/contact.model';
import { Subscription } from 'rxjs';
import { NotificationService } from 'app/shared/_services/notification.service';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styles: ['.operator-container {margin-right: 60px}']
})
export class ContactsComponent implements OnInit , OnDestroy {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  sub = new Subscription;

  pathEmployers = false;
  entity_types = EntityTypes;
  location: string;
  role = this.userSession.getRole() !== 'employer';

  constructor(public route: ActivatedRoute,
              private router: Router,
              private contactService: ContactService,
              private userSession: UserSessionService,
              private selectUnit: SelectUnitService,
              private notificationService: NotificationService  ) {
  }

  readonly columns =  [
    { name: 'organization_name', label: 'ארגון', searchable: false},
    { name: 'employer_name', label: 'מעסיק', searchable: false},
    { name: 'type', label: 'סוג גורם' , searchable: false},
    { name: 'name_type', label: 'שם גורם' , searchable: false},
    { name: 'name', label: 'שם מלא' },
    { name: 'phone', label: 'טלפון' , searchable: false},
    { name: 'mobile', label: 'טלפון נייד' , searchable: false},
    { name: 'email', label: 'כתובת מייל' },
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
        this.router.navigate([], {
          queryParams: {page: 1},
          relativeTo: this.route
        });
        this.fetchItems();
      }
    ));
  }

  deleteEmployerContact(id) {
    this.notificationService.warning('האם ברצונך למחוק את האיש קשר?')
      .then(confirmation => {
        if (confirmation.value) {
          this.contactService.deleteEmployerContact(id).then(response => {
            if (response) {
              this.fetchItems();
            }
          });
        }
      });
  }

  fetchItems() {
    const organizationId = this.selectUnit.currentOrganizationID;
    const employerId = this.selectUnit.currentEmployerID;

    if (employerId) {
      this.dataTable.criteria.filters['employerId'] = employerId;
    } else {
      this.dataTable.criteria.filters['organizationId'] = organizationId;
      this.dataTable.criteria.filters['employerId'] = 0;
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
