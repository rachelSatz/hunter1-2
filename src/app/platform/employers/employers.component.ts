import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { EmployerService } from '../../shared/_services/http/employer.service';
import { Employer } from '../../shared/_models/employer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectUnitService } from '../../shared/_services/select-unit.service';
import { PlatformComponent } from '../platform.component';
import { HelpersService } from '../../shared/_services/helpers.service';
import { UserSessionService } from '../../shared/_services/http/user-session.service';

@Component({
  selector: 'app-employers',
  templateUrl: './employers.component.html',
  styleUrls: ['./employers.component.css', '../../shared/data-table/data-table.component.css']
})
export class EmployersComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns  = [
    { name: 'identifier', label: 'ח.פ. מעסיק'},
    { name: 'name', label: 'שם מעסיק'},
    { name: 'is_active', label: ' סטטוס'},
  ];
  items: any[] = [{id: 1, identifier: '111', name: 'עמותת עטלף'}, {id: 2, identifier: '222', name: 'מכבי ביתי'}];
  permissionsType = this.userSession.getPermissionsType('employers');

  constructor(private EmployerService: EmployerService,
              private router: Router,
              public route: ActivatedRoute,
              private SelectUnitService: SelectUnitService,
              private PlatformComponent: PlatformComponent,
              private helpers: HelpersService,
              private userSession: UserSessionService) { }


  ngOnInit() {
    this.SelectUnitService.setActiveUrl('employers');
    this.fetchItems();
  }
  fetchItems(): void {

    this.helpers.setPageSpinner(true);
    this.EmployerService.getAllEmployers(this.dataTable.criteria)
      .then(response => {
        this.dataTable.setItems(response['1']);
        this.helpers.setPageSpinner(false);
      });
  }
  openEmployerFinanceDetails(employer: Employer): void {
      this.helpers.setPageSpinner(true);
      this.SelectUnitService.setEmployerID(employer.id);
      this.router.navigate(['./', 'form' , employer.id],  {relativeTo: this.route});
  }
}
