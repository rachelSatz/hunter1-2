import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';

import { EmployerService } from 'app/shared/_services/http/employer.service';

import { ExcelEmployersComponent } from './excel-employers/excel-employers.component';
import { MatDialog } from '@angular/material';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-employers',
  templateUrl: './employers.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', './employers.component.css']
})
export class EmployersComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  sub = new Subscription;

  readonly columns =  [
    { name: 'entity_name', label: 'שם מלא' , searchable: false},
    { name: 'entity_number', label: 'ח.פ' , searchable: false},
    { name: 'phone', label: 'טלפון' , searchable: false},
    { name: 'email', label: 'כתובת מייל' , searchable: false},
    { name: 'code5', label: 'קוד מוסד 5' , searchable: false},
    { name: 'code8', label: 'קוד מוסד 8' , searchable: false}
  ];

  constructor(route: ActivatedRoute, private employerService: EmployerService, private dialog: MatDialog,
              private selectUnit: SelectUnitService) {
  }

  ngOnInit() {
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
        this.dataTable.paginationData.currentPage = 1;
        this.dataTable.criteria.page = 1;
        this.fetchItems();
      }
    ));
  }

  fetchItems() {
    if (this.selectUnit.currentOrganizationID) {
      this.dataTable.criteria.filters['organizationId'] = this.selectUnit.currentOrganizationID;
      this.employerService.getEmployers(this.dataTable.criteria).then(response => this.setResponse(response));
    }
  }
  setResponse(response: any): void {
    this.dataTable.setItems(response);
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
