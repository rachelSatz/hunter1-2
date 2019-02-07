import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { MatDialog } from '@angular/material';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { EmployerStatus } from 'app/shared/_models/employer.model';

@Component({
  selector: 'app-employers',
  templateUrl: './employers.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', './employers.component.css']
})
export class EmployersComponent extends DataTableComponent  implements OnInit {

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

  constructor(route: ActivatedRoute,
              private employerService: EmployerService) {
    super(route);
  }

  ngOnInit() {
    this.employerService.getAllEmployers().then(response => this.setItems(response));

    super.ngOnInit();
  }
}
