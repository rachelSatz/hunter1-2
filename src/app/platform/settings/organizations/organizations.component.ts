import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrganizationService } from 'app/shared/_services/http/organization.service';
import { DataTableComponent } from '../../../shared/data-table-1/data-table.component';
import {NotificationService} from '../../../shared/_services/notification.service';

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
