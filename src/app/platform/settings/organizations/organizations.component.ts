import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OrganizationService } from 'app/shared/_services/http/organization.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css']
})
export class OrganizationsComponent implements OnInit , OnDestroy {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns =  [
    { name: 'name', label: 'שם ארגון' , searchable: false }
  ];

  constructor(route: ActivatedRoute, private organizationService: OrganizationService) {
  }

  ngOnInit() {
    this.organizationService.getOrganizationTable().then(response => {
      this.dataTable.setItems(response);
    });
  }

  ngOnDestroy() {
  }
}
