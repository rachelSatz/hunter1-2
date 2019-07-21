import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { placeholder, slideToggle } from 'app/shared/_animations/animation';
import { EmployerStatus } from 'app/shared/_models/employer.model';
import { UserSessionService } from 'app/shared/_services/user-session.service';


@Component({
  selector: 'app-employers',
  templateUrl: './employers.component.html',
  animations: [ slideToggle, placeholder]
})
export class EmployersComponent  implements OnInit , OnDestroy {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  sub = new Subscription;
  employerStatus = EmployerStatus;

  readonly columns =  [
    { name: 'organization_name', label: 'ארגון' },
    { name: 'employer_name', label: 'מעסיק' },
    { name: 'entity_number', label: 'מספר ח"פ' },
    { name: 'email', label: 'כתובת מייל' },
    { name: 'phone', label: 'טלפון' },
    { name: 'mobile', label: 'טלפון נייד' },
    { name: 'address', label: 'כתובת' },
    { name: 'status', label: 'סטטוס' }

  ];

  constructor(protected route: ActivatedRoute,
              private router: Router,
              private employerService: EmployerService,
              public userSession: UserSessionService,
              private selectUnit: SelectUnitService) {
  }

  ngOnInit() {
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
        this.router.navigate([], {
          queryParams: {page: 1},
          relativeTo: this.route
        });
        this.fetchItems();
      }
    ));
  }

  fetchItems() {
    this.dataTable.criteria.filters['organizationId'] = this.selectUnit.currentOrganizationID;
    this.dataTable.criteria.filters['employerId'] = this.selectUnit.currentEmployerID;

    this.employerService.getAllEmployers(this.dataTable.criteria).then(
        response => this.setResponse(response));
  }

  setResponse(response: any): void {
    this.dataTable.setItems(response);
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
