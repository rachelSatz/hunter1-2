import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { SelectUnitService } from '../../../shared/_services/select-unit.service';
import { Project } from '../../../shared/_models/project.model';
import { GeneralService } from '../../../shared/_services/http/general.service';
import { CalcProcessService } from '../../../shared/_services/http/calc-process.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {Organization} from '../../../shared/_models/organization';

@Component({
  selector: 'app-calc-processes',
  templateUrl: './calc-processes.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css']
})
export class CalcProcessesComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns  = [
    // tslint:disable-next-line:max-line-length
    { name: 'projector', sortName: 'project_group_name', label: 'שם פרויקט על'},
    { name: 'created_at', label: 'תאריך', searchOptions: { isDate: true }},
    { name: 'count_employers', label: 'סה"כ מעסיקים'},
    { name: 'count_employees', label: 'סה"כ ת.ז'},
    { name: 'amount_invoices', label: 'סכום'}
    // { name: 'project_group_id', label: 'פרויקט על', isDisplay: false, searchable: false }
  ];
  projector: Organization[];
  projects: Project[];
  sub = new Subscription;
  filters = {};

  constructor(private SelectUnitService: SelectUnitService,
              public route: ActivatedRoute,
              private GeneralService: GeneralService,
              private CalcProcessService: CalcProcessService) { }

  ngOnInit() {
    this.SelectUnitService.setActiveUrl('finance');
    this.sub = this.route.params.subscribe(v => {
      if (v['from_date']) {
        if (v['project_group_id']) {
          this.filters['project_group_id'] = +v['project_group_id'];
        }
        if (+v['project_id'] !== 0) {
          this.filters['project_id'] = +v['project_id'];
        }
        this.filters['created_at[from]'] = v['from_date'];
        this.filters['created_at[to]'] = v['to_date'];
      }
    });
    // if (this.SelectUnitService.getProjectGroupId() === 1) {
    //   this.GeneralService.getProjects(1).then(response =>
    //   this.columns[0]['searchOptions'].labels = response['data']);
    // }
  }

  fetchItems(): void {
    if (this.filters['project_id']) {
      this.dataTable.criteria.filters = this.filters;
    }
    this.CalcProcessService.getCalcProcesses(this.dataTable.criteria)
      .then(response => {
        this.dataTable.setItems(response);
      });
  }
}
