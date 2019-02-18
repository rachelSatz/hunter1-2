import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';

import { EmployerService } from 'app/shared/_services/http/employer.service';

import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { ExcelEmployersComponent } from './excel-employers/excel-employers.component';
import { MatDialog } from '@angular/material';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-employers',
  templateUrl: './employers.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', './employers.component.css']
})
export class EmployersComponent extends DataTableComponent implements OnInit, OnDestroy {

  sub = new Subscription;

  readonly headers: DataTableHeader[] =  [
    { column: 'entity_name', label: 'שם מלא' }, { column: 'entity_number', label: 'ח.פ' },
    { column: 'phone', label: 'טלפון' }, { column: 'email', label: 'כתובת מייל' },
    { column: 'code5', label: 'קוד מוסד 5' }, { column: 'code8', label: 'קוד מוסד 8' }
  ];

  constructor(route: ActivatedRoute, private employerService: EmployerService, private dialog: MatDialog,
              private selectUnit: SelectUnitService) {
    super(route);
  }

  ngOnInit() {
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
      this.fetchItems();
    }));

    super.ngOnInit();
  }

  fetchItems(): void {
    if (this.selectUnit.currentOrganizationID) {
      this.searchCriteria['organizationId'] = this.selectUnit.currentOrganizationID;
      this.employerService.getEmployers(this.searchCriteria).then(response => this.setItems(response));
    }
  }

  openExcelEmployersDialog(): void {
    this.dialog.open(ExcelEmployersComponent, {
      width: '450px',
      panelClass: 'excel-employers-dialog'
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
