import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableComponent} from '../../shared/data-table/data-table.component';
import {EmployerService} from '../../shared/_services/http/employer.service';
import {DataTableCriteria} from '../../shared/data-table/classes/data-table-criteria';
import {DataTableResponse} from '../../shared/data-table/classes/data-table-response';
import {Employer} from '../../shared/_models/employer.model';
import {ActivatedRoute, Router} from '@angular/router';
import {SelectUnitService} from '../../shared/_services/select-unit.service';
import {PlatformComponent} from '../platform.component';

@Component({
  selector: 'app-employers',
  templateUrl: './employers.component.html',
  styleUrls: ['./employers.component.css','../../shared/data-table/data-table.component.css']
})
export class EmployersComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns  = [
    { name: 'id', label: 'קוד מעסיק', searchable: false},
    { name: 'identifier', label: 'ח.פ. מעסיק'},
    { name: 'name', label: 'שם מעסיק'},
    { name: 'is_active', label: ' סטטוס'},
  ];
  constructor(private EmployerService: EmployerService,
              private router: Router,
              public route: ActivatedRoute,
              private SelectUnitService: SelectUnitService,
              private PlatformComponent: PlatformComponent) { }

  items: any[] = [{id: 1, identifier: '111', name: 'עמותת עטלף'},{id: 2, identifier:'222', name: 'מכבי ביתי'}];
  ngOnInit() {
    // this.dataTable.criteria = new DataTableCriteria(4);
    // this.dataTable.criteria.isCheckAll = true;
    // this.dataTable.setItems(new DataTableResponse(this.items,2,2));
    // //this.fetchItems();
  }
  fetchItems(): void{
    this.EmployerService.getAllEmployers(this.dataTable.criteria)
      .then(response => {
        console.log(response);
        this.dataTable.setItems(response['1']);
      })
  }
  openEmployerFinanceDetails(employer: Employer){
    this.SelectUnitService.setEmployerID(employer.id);
    this.PlatformComponent.employerId = employer.id;
    this.router.navigate(['./','form' , employer.id],  {relativeTo: this.route});
  }
}
