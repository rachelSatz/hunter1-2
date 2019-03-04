import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { placeholder, slideToggle } from 'app/shared/_animations/animation';
import { EmployerStatus } from 'app/shared/_models/employer.model';


@Component({
  selector: 'app-employers',
  templateUrl: './employers.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css'],
  animations: [ slideToggle, placeholder]
})
export class EmployersComponent extends DataTableComponent  implements OnInit , OnDestroy {

  sub = new Subscription;
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

  constructor(protected route: ActivatedRoute,
              private employerService: EmployerService,
              private selectUnit: SelectUnitService) {
    super(route);
    this.paginationData.limit = 12;
  }

  ngOnInit() {
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => this.fetchItems()));

    super.ngOnInit();
  }

  fetchItems() {
      this.searchCriteria['organizationId'] = this.selectUnit.currentOrganizationID;
      this.searchCriteria['employerId'] = this.selectUnit.currentEmployerID;

      this.employerService.getAllEmployers(this.searchCriteria).then(
        response => this.setItems(response));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    super.ngOnDestroy();
  }
}
