import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EmployerService } from 'app/shared/_services/http/employer.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';

@Component({
  selector: 'app-defrayal',
  templateUrl: './defrayal.component.html',
  styleUrls: ['../../../../../shared/data-table/data-table.component.css']
})
export class DefrayalComponent extends DataTableComponent  implements OnInit , OnDestroy {


  readonly headers: DataTableHeader[] =  [
    { column: 'product_id', label: 'מס קופה' },
    { column: 'product_name', label: 'שם קופה' },
    { column: 'company_name', label: 'שם חברה' },
    { column: 'bank', label: 'בנק' },
    { column: 'branch', label: 'סניף' },
    { column: 'account', label: 'מספר חשבון' },
  ];


  constructor(protected route: ActivatedRoute,
              private employerService: EmployerService,
              private selectUnit: SelectUnitService) {
    super(route);
  }

  ngOnInit() {
    this.paginationData.limit = 5;
    this.employerService.getEmployerBankAccounts(this.selectUnit.currentEmployerID).then(
      response => this.setItems(response));
    super.ngOnInit();
  }





}
