import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableComponent} from '../../../shared/data-table/data-table.component';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';
import {Project} from '../../../shared/_models/project.model';
import {GeneralService} from '../../../shared/_services/http/general.service';

@Component({
  selector: 'app-calc-processes',
  templateUrl: './calc-processes.component.html',
  styleUrls: ['./calc-processes.component.css','../../../shared/data-table/data-table.component.css']
})
export class CalcProcessesComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns  = [
    { name: 'project_name', sortName:'project__project_name', label: 'שם פרויקט', searchOptions: { labels: this.GeneralService.projects} },
    { name: 'created_at', label: 'תאריך'},
    { name: 'count_employers', label: 'סה"כ מעסיקים'},
    { name: 'count_employees', label: 'סה"כ ת.ז'},
    { name: 'amount_invoices', label: 'סכום'}
  ];
  projects: Project[]
  constructor(private SelectUnitService: SelectUnitService,
              private GeneralService: GeneralService) { }

  ngOnInit() {
    if(this.SelectUnitService.getOrganization()===1){
      this.GeneralService.getProjects(1).then(response =>
      this.columns[0]['searchOptions'].labels = response[('1')]
      )
    }
  }

}
