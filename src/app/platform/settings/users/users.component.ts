import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableComponent } from 'app/shared/data-table-1/data-table.component';
import { AppHttpService } from 'app/shared/_services/http/app-http.service';
import { UserService } from 'app/shared/_services/http/user.service';
import { EntityRoles } from 'app/shared/_models/user.model';
import { NotificationService } from '../../../shared/_services/notification.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css']
})
export class UsersComponent  implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  user: any;
  role =  Object.keys(EntityRoles).map(function(e) {
    return { id: e, name: EntityRoles[e] };
  });

  readonly columns =  [
    { name: 'user_name', label: 'שם משתמש', searchable: false},
    { name: 'user_type', label: 'סוג משתמש', searchOptions: { labels: this.role }},
    { name: 'name', label: 'שם מלא' , searchable: false},
    { name: 'email', label: 'מייל' , searchable: false}
  ];

  constructor(route: ActivatedRoute,
              private userService: UserService,
              private appHttp: AppHttpService,
              protected notificationService: NotificationService) {
  }

  ngOnInit() {
    this.fetchItems();
    this.dataTable.placeHolderSearch = 'שם משתמש';
  }

  fetchItems() {
    this.userService.getUsers(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
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
