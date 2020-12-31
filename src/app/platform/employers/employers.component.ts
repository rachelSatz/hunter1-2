import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { EmployerService } from '../../shared/_services/http/employer.service';
import { Employer } from '../../shared/_models/employer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectUnitService } from '../../shared/_services/select-unit.service';
import { PlatformComponent } from '../platform.component';
import { HelpersService } from '../../shared/_services/helpers.service';
import { UserSessionService } from '../../shared/_services/http/user-session.service';
import { Subscription } from 'rxjs';
import {el} from '@angular/platform-browser/testing/src/browser_util';

@Component({
  selector: 'app-employers',
  templateUrl: './employers.component.html',
  styleUrls: ['./employers.component.css', '../../shared/data-table/data-table.component.css']
})
export class EmployersComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns = [
    {name: 'org_name', label: 'ארגון'},
    {name: 'identifier', label: 'ח.פ. מעסיק'},
    {name: 'name', label: 'שם מעסיק'},
    {name: 'is_active', label: ' סטטוס', searchable: false},
  ];
  items: any[] = [{id: 1, identifier: '111', name: 'עמותת עטלף'}, {id: 2, identifier: '222', name: 'מכבי ביתי'}];
  permissionsType = this.userSession.getPermissionsType('employers');
  sub = new Subscription;

  constructor(private EmployerService: EmployerService,
              private router: Router,
              public route: ActivatedRoute,
              private selectUnit: SelectUnitService,
              private platformComponent: PlatformComponent,
              private helpers: HelpersService,
              private userSession: UserSessionService) {
  }

  ngOnInit() {
    this.selectUnit.setActiveUrl('employers');
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
      this.fetchItems();
    }));
    this.fetchItems();

  }

  fetchItems(): void {
      this.EmployerService.getAllEmployers(this.dataTable.criteria, this.dataTable.isActive, this.selectUnit.getProjectGroupId())
      .then(response => {
        console.log(response);
        this.dataTable.setItems(response);
        });
  }

  openEmployerFinanceDetails(employer: Employer): void {
    if (employer.is_active) {
      this.selectUnit.setOrganizationID(employer.org_id);
      this.selectUnit.setEmployerID(employer.id);
      this.router.navigate(['./', 'form' , employer.id],  {relativeTo: this.route});
    }
  }
}
