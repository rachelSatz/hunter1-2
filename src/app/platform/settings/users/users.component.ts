import { Component, OnInit } from '@angular/core';
import {DataTableHeader} from '../../../shared/data-table/classes/data-table-header';
import {ActivatedRoute} from '@angular/router';
import { UserService } from '../../../shared/_services/http/user.service';
import {DataTableComponent} from '../../../shared/data-table/data-table.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css']
})
export class UsersComponent extends DataTableComponent {

  readonly headers: DataTableHeader[] =  [
    { column: 'user_name', label: 'שם משתמש' }, { column: 'user_type', label: 'סוג משתמש' },
    { column: 'name', label: 'שם מלא' }, { column: 'email', label: 'מייל' }
  ];

  constructor(route: ActivatedRoute, private userService: UserService) {
    super(route);
  }

  fetchItems(): void {
    this.userService.getUsers().then(response => this.setItems(response));
  }

}
