import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';

@Component({
  selector: 'app-manufacturer-number',
  templateUrl: './manufacturer-number.component.html',
})
export class ManufacturerNumberComponent implements OnInit {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns =  [
    { name: 'product_id', label: 'מס קופה' },
    { name: 'product_name', label: 'שם קופה' },
    { name: 'company_name', label: 'שם חברה' },
    { name: 'bank', label: 'בנק' },
    { name: 'branch', label: 'סניף' },
    { name: 'account', label: 'מספר חשבון' },
  ];


  constructor(protected route: ActivatedRoute,
              private router: Router,
              private employerService: EmployerService,
              private selectUnit: SelectUnitService) {
  }

  ngOnInit() {
    this.dataTable.criteria.limit = 5;

  }

  fetchItems() {
    this.employerService.getEmployerBankAccounts( this.dataTable.criteria , this.selectUnit.currentEmployerID).then(
      response => this.dataTable.setItems(response));
  }
}
