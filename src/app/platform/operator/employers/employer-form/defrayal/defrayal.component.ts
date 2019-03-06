import {Component, OnDestroy, OnInit} from '@angular/core';
import {EmployerService} from '../../../../../shared/_services/http/employer.service';
import {DataTableComponent} from '../../../../../shared/data-table/data-table.component';
import {ActivatedRoute} from '@angular/router';
import {SelectUnitService} from '../../../../../shared/_services/select-unit.service';
import {DataTableHeader} from '../../../../../shared/data-table/classes/data-table-header';

@Component({
  selector: 'app-defrayal',
  templateUrl: './defrayal.component.html',
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
    this.employerService.getEmployerBankAccount(this.selectUnit.currentEmployerID).then(
      response => this.setItems(response));
    super.ngOnInit();
  }





}
