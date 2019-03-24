import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { AppHttpService } from 'app/shared/_services/http/app-http.service';
import { UserService } from 'app/shared/_services/http/user.service';
import { EntityRoles } from 'app/shared/_models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css']
})
export class UsersComponent extends DataTableComponent  implements OnInit {

  user = [];
  role =  Object.keys(EntityRoles).map(function(e) {
    return { id: e, name: EntityRoles[e] };
  });

  readonly headers: DataTableHeader[] =  [
    { column: 'user_name', label: 'שם משתמש' }, { column: 'user_type', label: 'סוג משתמש' },
    { column: 'name', label: 'שם מלא' }, { column: 'email', label: 'מייל' }
  ];

  constructor(route: ActivatedRoute,
              private userService: UserService,
              private appHttp: AppHttpService) {
    super(route);
  }

  ngOnInit() {
    this.fetchItems();
    super.ngOnInit();
  }

  fetchItems() {
    this.userService.getUsers(this.searchCriteria).then(response => {
      this.setItems(response);
      this.user = response;
    });
  }

  register(item: any): void {
  this.appHttp.forgotPassword(item.username, item.email).then(
    response => {
      if (response['message'] === 'No User Found' || response['message'] !== 'Message_Sent') {
      this.notificationService.error(
        response['message'] === 'No User Found' ?
          'השם משתמש או המייל שגוי' : 'קימת בעיה בשליחת המייל');
      }
    });
  }
}
