import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { EntityRoles, User } from '../../shared/_models/user.model';
import { ActivatedRoute } from '@angular/router';
import { AppHttpService } from '../../shared/_services/http/app-http.service';
import { UserSessionService } from '../../shared/_services/http/user-session.service';
import { NotificationService } from '../../shared/_services/notification.service';
import { UserService } from '../../shared/_services/http/user.service';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { SelectUnitService } from '../../shared/_services/select-unit.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  user: any;
  role =  Object.keys(EntityRoles).map(function(e) {
    return { id: e, name: EntityRoles[e] };
  });
  isDisplay = this.userSession.getPermissionsType('users');

  readonly columns =  [
    { name: 'created_at', label: 'תאריך', searchOptions: { isDate: true }},
    { name: 'first_name', label: 'שם פרטי' , searchable: false},
    { name: 'last_name', label: 'שם משפחה' , searchable: false},
    { name: 'phone', label: 'טלפון נייד' , searchable: false},
    { name: 'email', label: 'אימייל' , searchable: false},
    { name: 'role', label: 'סוג משתמש', searchOptions: { labels: this.role }}
  ];

  constructor(route: ActivatedRoute,
              private appHttp: AppHttpService,
              private userSession: UserSessionService,
              protected notificationService: NotificationService,
              private userService: UserService,
              private helpers: HelpersService,
              private selectUnit: SelectUnitService) { }

  ngOnInit() {
    this.selectUnit.setActiveUrl('users');
    this.fetchItems();
    this.dataTable.placeHolderSearch = 'שם משתמש';
  }

  fetchItems() {
    this.userService.getUsers(this.dataTable.criteria, this.dataTable.isActive).then(response => {
      this.dataTable.setItems(response);
      this.user = response;
    });
  }

  restoreUser(user: User): void {
    console.log(user);
    const buttons = {confirmButtonText: 'אישור', cancelButtonText: 'ביטול'};
    const text = '  האם ברצונך לשחזר משתמש ' + user.first_name + ' ' + user.last_name + ' ?';
    this.notificationService.warning(text, '', buttons).then(confirmation => {
      if (confirmation.value) {
        user.is_active = true;
        this.userService.updateUser(user, user.id).then(response => {
          this.helpers.setPageSpinner(false);
          if (response) {
            if (response['message'] === 'User updated.') {
              this.notificationService.success('המשתמש שוחזר בהצלחה.');
              this.fetchItems();
            } else {
              this.notificationService.error('ארעה שגיאה.');
            }
          }
        });
      }
    });
  }

  deleteUser(user: User): void{
    console.log(user);
    const buttons = {confirmButtonText: 'אישור', cancelButtonText: 'ביטול'};
    const text = '  האם ברצונך למחוק משתמש ' + user.first_name + ' ' + user.last_name + ' מהמערכת?';
    this.notificationService.warning(text, '', buttons).then(confirmation => {
      if (confirmation.value) {
        user.is_active = false;
        this.userService.updateUser(user, user.id).then(response => {
          this.helpers.setPageSpinner(false);
          if (response) {
            if (response['message'] === 'User updated.') {
              this.notificationService.success('המשתמש נמחק בהצלחה.');
              this.fetchItems();
            } else {
              this.notificationService.error('ארעה שגיאה.');
            }
          }
        });
      }
    });
  }

  register(item: any): void {
    this.appHttp.forgotPassword(item.email).then(
      response => {
        if (response['message'] === 'No User Found' || response['message'] !== 'Message_Sent') {
          this.notificationService.error(
            response['message'] === 'No User Found' ?
              'השם משתמש או המייל שגוי' : 'קימת בעיה בשליחת המייל');
        } else {
          this.notificationService.success('מייל איפוס סיסמא נשלח בהצלחה');
        }
      });
  }
}
