import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { SelectUnitService } from '../../../shared/_services/select-unit.service';
import { GeneralService } from '../../../shared/_services/http/general.service';
import { CalcProcessService } from '../../../shared/_services/http/calc-process.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-calc-processes',
  templateUrl: './calc-processes.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css']
})
export class CalcProcessesComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns  = [
    { name: 'created_at', label: 'תאריך', searchOptions: { isDate: true }},
    { name: 'count_employers', label: 'סה"כ מעסיקים', searchable: false},
    { name: 'count_employees', label: 'סה"כ ת.ז' , searchable: false},
    { name: 'amount_invoices', label: 'סכום', searchable: false }
  ];
  sub = new Subscription;
  filters = {};

  constructor(private selectUnit: SelectUnitService,
              public route: ActivatedRoute,
              private calcProcessService: CalcProcessService) { }

  ngOnInit() {
    this.selectUnit.setActiveUrl('finance');
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
      this.fetchItems();
    }));
    this.fetchItems();
  }

  fetchItems(): void {
    this.sub = this.route.params.subscribe(v => {
      if (v['from_date']) {
        this.filters['created_at[from]'] = v['from_date'];
        this.filters['created_at[to]'] = v['to_date'];
      }
    });
    this.calcProcessService.getCalcProcesses(this.dataTable.criteria)
      .then(response => {
        this.dataTable.setItems(response);
      });
  }
}
