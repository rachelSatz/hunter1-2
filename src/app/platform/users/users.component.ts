import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableComponent} from '../../shared/data-table/data-table.component';
import {EntityRoles} from '../../shared/_models/user.model';
import {ActivatedRoute} from '@angular/router';
import {AppHttpService} from '../../shared/_services/http/app-http.service';
import {UserSessionService} from '../../shared/_services/http/user-session.service';
import {NotificationService} from '../../shared/_services/notification.service';
import {UserService} from '../../shared/_services/http/user.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  user: any;
  role =  Object.keys(EntityRoles).map(function(e) {
    return { id: e, name: EntityRoles[e] };
  });
  isDisplay = true;
  //isDisplay = this.userSession.getPermissionsType('user_management', true);

  readonly columns =  [
    { name: 'user_name', label: 'שם משתמש', searchable: false},
    { name: 'user_type', label: 'סוג משתמש', searchOptions: { labels: this.role }},
    { name: 'name', label: 'שם מלא' , searchable: false},
    { name: 'email', label: 'מייל' , searchable: false}
  ];


  constructor(route: ActivatedRoute,
              private appHttp: AppHttpService,
              private userSession: UserSessionService,
              protected notificationService: NotificationService,
              private userService: UserService) { }

  ngOnInit() {
    this.fetchItems();
    this.dataTable.placeHolderSearch = 'שם משתמש';
  }
  fetchItems() {
    debugger;
    this.userService.getUsers(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
      this.user = response;
    });
  }
}
