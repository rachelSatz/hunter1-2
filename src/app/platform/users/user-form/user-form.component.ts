import {Component, OnInit, ViewChild} from '@angular/core';
import {fade} from '../../../shared/_animations/animation';
import {DataTableComponent} from '../../../shared/data-table/data-table.component';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {EntityRoles, User} from '../../../shared/_models/user.model';
import {UserUnitPermission} from '../../../shared/_models/user-unit-permission.model';
import {ModuleTypes} from '../../../shared/_models/user-module.model';
import {UserSessionService} from '../../../shared/_services/http/user-session.service';
import {NgForm} from '@angular/forms';
import {UserService} from '../../../shared/_services/http/user.service';
import { Location } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {DataTableResponse} from '../../../shared/data-table/classes/data-table-response';
import {NotificationService} from '../../../shared/_services/notification.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styles: [`.check-module { width: 140px; } .displayNone{ display: none}
  ::ng-deep .change-projectManager-component .mat-dialog-container { overflow: visible; }` ],
  animations: [ fade ],
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  public Editor = ClassicEditor;
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  user = new User(null);
  permission = new UserUnitPermission();
  hasServerError: boolean;
  projects = [];
  employers = [];
  message: string;
  moduleTypes = ModuleTypes;
  update = false;
  add = false;
  role = this.userSeService.getRole();
  units: any;
  roles = Object.keys(EntityRoles).map(function (e) {
    return {id: e, name: EntityRoles[e]};
  });

  modules = Object.keys(ModuleTypes).map(function (e) {
    return {id: e, name: ModuleTypes[e]};
  });

  items: Array<any>=new Array<any>(this.modules.length)
  htmlstring: string;
  readonly columns  = [
    { name: 'module', label: 'מודול', searchable: false},
    { name: 'watching', label: "צפייה"},
    { name: 'actions', label: 'ביצוע פעולות'},
    // { name: 'Alerts', label: 'התראות' , searchable: false},
  ];
  not_valid: boolean =false;
  constructor(private userSeService: UserSessionService,
              private userService:UserService,
              private _location: Location,
              private route: ActivatedRoute,
              private notificationService: NotificationService) { }

  ngOnInit() {
    if (this.route.snapshot.data.user) {
      this.update = true;
      this.user = new User(this.route.snapshot.data.user);
      this.units = this.user.units;
      console.log(this.user.modules)
    }
    // this.htmlstring = '<div class="custom-control custom-switch">\n' +
    //   '            <input type="checkbox" class="custom-control-input" id="{{ \'switch4-\' + i }}">\n' +
    //   '            <label class="custom-control-label" for="{{ \'switch4-\' + i }}"> </label>\n' +
    //   '          </div>'
  }
  private handleResponse(isSaved: any): void {
    this.message = isSaved['message'];
    if (this.message === 'username_exist') {
      //this.hasServerError = true;
      this.notificationService.error('משתמש עם כתובת אימייל זו קיים במערכת') ;
      this.user.email ="";
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
  fetchItems(){
  }
  changePermission(event: any, module, index): void{
    if(event.checked==true){
      if(this.user.modules[index].isEnabled ==false) {
        this.user.modules[index].isEnabled =true;
        this.user.modules[index].permission_type =event.source['ariaLabel']
      }
      else {
        if(this.user.modules[index].permission_type == 'read'){
          this.user.modules[index].permission_type ='all'
        }
      }
    }
    else {
      if(this.user.modules[index].permission_type == 'read'){
        this.user.modules[index].isEnabled =false;
        this.user.modules[index].permission_type = 'read'
      } else {
          this.user.modules[index].permission_type = 'read'
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
       if (this.user.modules.some(m => m.isEnabled) && (( this.user.units.length>0 && this.user.units[0].project_group_id)|| this.user.role === 'admin' || this.user.id === undefined)) {
         if (this.user.id) {
           this.userService.updateUser(this.user, this.user.id).then(response => this.handleResponse(response));
         } else {
           this.userService.saveNewUser(this.user).then(response => this.handleResponse(response));
         }
       }
     }
     else {
       this.not_valid = true;
     }
  }

  onReady(){

  }
  setPermission(){

  }
  hasDisabled(){

  }
  selectedEmployer(){

  }
  addUnitPermissionRow(){

  }
  removeUnitPermissionRow(){

  }
}
