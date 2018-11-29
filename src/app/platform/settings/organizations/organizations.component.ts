import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTableHeader } from '../../../shared/data-table/classes/data-table-header';

import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { OrganizationService } from 'app/shared/_services/http/organization.service';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css']
})
export class OrganizationsComponent extends DataTableComponent  implements OnInit {


  readonly headers: DataTableHeader[] =  [
    { column: 'name', label: 'שם ארגון' }
  ];

  constructor(route: ActivatedRoute, private organizationService: OrganizationService) {
    super(route);
  }

  ngOnInit() {
    this.fetchItems();
    super.ngOnInit();
  }

  fetchItems(): void {
    this.organizationService.getOrganizations().then(response => this.setItems(response));
  }
}
