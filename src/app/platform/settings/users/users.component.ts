import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataTableHeader} from '../../../shared/data-table/classes/data-table-header';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../../shared/_services/http/user.service';
import {DataTableComponent} from '../../../shared/data-table/data-table.component';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css']
})
export class UsersComponent extends DataTableComponent  implements OnInit, OnDestroy {

  employers = [];
  user = [];
  role = [{'id': 1, 'name': 'מנהל'}, {'id': 2, 'name': 'מתפעל'}, {'id': 3, 'name': 'מעסיק'}];

  readonly headers: DataTableHeader[] =  [
    { column: 'user_name', label: 'שם משתמש' }, { column: 'user_type', label: 'סוג משתמש' },
    { column: 'name', label: 'שם מלא' }, { column: 'email', label: 'מייל' }
  ];

  constructor(route: ActivatedRoute, private userService: UserService, private employerService: EmployerService,
              private selectUnit: SelectUnitService) {
    super(route);
  }

  ngOnInit() {
    console.log(this.selectUnit.currentOrganizationID);
    this.employerService.getEmployers(this.selectUnit.currentOrganizationID ).then(response => this.employers = response);
    this.fetchItems();
  }

  fetchItems(): void {
    this.userService.getUsers(this.searchCriteria).then(response => {
      this.setItems(response);
      this.user = response;
    });
  }
}
