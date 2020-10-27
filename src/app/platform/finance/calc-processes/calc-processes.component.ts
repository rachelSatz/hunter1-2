import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableComponent} from '../../../shared/data-table/data-table.component';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';
import {Project} from '../../../shared/_models/project.model';
import {GeneralService} from '../../../shared/_services/http/general.service';
import {calcProcessService} from '../../../shared/_services/http/calc_process.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {PlatformComponent} from '../../platform.component';

@Component({
  selector: 'app-calc-processes',
  templateUrl: './calc-processes.component.html',
  styleUrls: ['./calc-processes.component.css','../../../shared/data-table/data-table.component.css']
})
export class CalcProcessesComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns  = [
    { name: 'project_id', sortName:'project__project_name', label: 'שם פרויקט', searchOptions: { labels: this.GeneralService.projects} },
    { name: 'created_at', label: 'תאריך', searchOptions: { isDate: true }},
    { name: 'count_employers', label: 'סה"כ מעסיקים'},
    { name: 'count_employees', label: 'סה"כ ת.ז'},
    { name: 'amount_invoices', label: 'סכום'}
  ];
  projects: Project[];
  sub = new Subscription;
  filters = {};

  constructor(private SelectUnitService: SelectUnitService,
              public route:ActivatedRoute,
              private GeneralService: GeneralService,
              private calcProcessService: calcProcessService,
              private PlatformComponent: PlatformComponent) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(v => {
      if(v['project_id']){
        this.filters['project_id'] = +v['project_id'];
        this.filters['created_at[from]'] = v['from_date'];
        this.filters['created_at[to]'] = v['to_date'];
        console.log(this.filters);
      }
    })
    // this.PlatformComponent.activeUrl = 'finance';
    if(this.SelectUnitService.getOrganization()===1){
      this.GeneralService.getProjects(1).then(response =>
      this.columns[0]['searchOptions'].labels = response[('1')]
      )
    }
  }
  fetchItems(): void{
    if(this.filters['project_id']){
      this.dataTable.criteria.filters = this.filters;
    }
    this.calcProcessService.getCalcProcesses(this.dataTable.criteria)
      .then(response =>{
        this.dataTable.setItems(response);
      })
  }
}
