import { Component, OnInit, ViewChild } from '@angular/core';
import { fade } from '../../../shared/_animations/animation';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EntityRoles, User } from '../../../shared/_models/user.model';
import { ModuleTypes } from '../../../shared/_models/user-module.model';
import { UserSessionService } from '../../../shared/_services/http/user-session.service';
import { NgForm } from '@angular/forms';
import { UserService } from '../../../shared/_services/http/user.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'app/shared/_services/notification.service';
import { HelpersService } from 'app/shared/_services/helpers.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styles: [`.displayNone{ display: none} ::ng-deep .change-projectManager-component .mat-dialog-container { overflow: visible; }` ],
  animations: [ fade ],
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  public Editor = ClassicEditor;
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;
  user = new User(null);
  hasServerError: boolean;
  projects = [];
  employers = [];
  message: string;
  moduleTypes = ModuleTypes;
  update = false;
  add = false;
  units: any;
  roles = Object.keys(EntityRoles).map(function (e) {
    return {id: e, name: EntityRoles[e]};
  });
  modules = Object.keys(ModuleTypes).map(function (e) {
    return {id: e, name: ModuleTypes[e]};
  });
  items: Array<any>= new Array<any>(this.modules.length)
  readonly columns  = [
    { name: 'module', label: 'מודול', searchable: false},
    { name: 'watching', label: 'צפיה'},
    { name: 'actions', label: 'ביצוע פעולות'},
  ];
  not_valid = false;
  constructor(private userSeService: UserSessionService,
              private userService: UserService,
              private _location: Location,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private helpers: HelpersService) { }

  ngOnInit() {
    if (this.route.snapshot.data.user) {
      this.helpers.setPageSpinner(true);
      this.update = true;
      this.user = new User(this.route.snapshot.data.user);
      console.log(this.units);
      this.units = this.user.units;
      this.helpers.setPageSpinner(false);

    }
  }
  private handleResponse(isSaved: any): void {
    this.helpers.setPageSpinner(false);
    this.message = isSaved['message'];
    if (this.message === 'username_exist') {
      this.notificationService.error('משתמש עם כתובת אימייל זו קיים במערכת') ;
      this.user.email = '';
    } else {
      if (this.message === 'failed') {
        this.hasServerError = true;
        this.message = 'שגיאת שרת, נסה שנית או צור קשר.';
      } else {
        this.notificationService.success('משתמש נשמר בהצלחה');
        this.previous();
      }
    }
  }
  fetchItems() {
  }
  changePermission(event: any, module, index): void{
    if (event.checked === true) {
      if (this.user.modules[index].isEnabled === false) {
        this.user.modules[index].isEnabled = true;
        this.user.modules[index].permission_type = event.source['ariaLabel'];
      } else {
        if (this.user.modules[index].permission_type === 'read') {
          this.user.modules[index].permission_type = 'all';
        }
      }
    } else {
      if (this.user.modules[index].permission_type === 'read') {
        this.user.modules[index].isEnabled = false;
        this.user.modules[index].permission_type = 'read';
      } else {
          this.user.modules[index].permission_type = 'read';
      }
    }
  }

  previous(): void {
    this._location.back();
  }

  submit(form: NgForm): void {
    this.user.project_group_id = 1;
    this.user.units = [];
    this.hasServerError = false;
     if (form.valid) {
       this.helpers.setPageSpinner(true);
       if (this.user.id) {
           this.userService.updateUser(this.user, this.user.id).then(response => this.handleResponse(response));
         } else {
           this.userService.saveNewUser(this.user).then(response => this.handleResponse(response));
         }
       } else {
       this.not_valid = true;
     }
  }
}
