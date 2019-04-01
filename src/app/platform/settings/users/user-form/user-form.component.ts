import {ActivatedRoute, Router} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserService } from 'app/shared/_services/http/user.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { OrganizationService } from 'app/shared/_services/http/organization.service';

import { UserUnitPermission } from 'app/shared/_models/user-unit-permission.model';
import { ModuleTypes } from 'app/shared/_models/user-module.model';
import { Department } from 'app/shared/_models/department.model';
import { Employer } from 'app/shared/_models/employer.model';
import { EntityRoles } from 'app/shared/_models/user.model';
import { User } from 'app/shared/_models/user.model';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styles: [`.check-module { width: 140px; } .displayNone{ display: none}` ],
  animations: [ fade ]
})
export class UserFormComponent implements OnInit {

  user = new User(null);
  hasServerError: boolean;
  organizations = [];
  departments = [];
  employers = [];
  employees = [];
  message: string;
  moduleTypes = ModuleTypes;
  update = false;

  roles = Object.keys(EntityRoles).map(function (e) {
    return {id: e, name: EntityRoles[e]};
  });

  constructor(private route: ActivatedRoute, private employerService: EmployerService,
              private router: Router,
              private userService: UserService, private organizationService: OrganizationService
  ) {
  }

  ngOnInit() {
    this.organizationService.getOrganizations().then(
      response => this.organizations = response);
    if (this.route.snapshot.data.user) {
      this.update = true;
      this.user = new User(this.route.snapshot.data.user);
      if (!this.user.units) {
        this.user.units = [];
        this.user.units.push(new UserUnitPermission());
      }
    }
  }

  selectedEmployer(permission: UserUnitPermission, index: number): Employer[] {
    if (this.organizations.length > 0) {
      const selectedOrganization = this.organizations.find(o => {
        return +o.id === +permission.organization_id;
      });

      this.employers = selectedOrganization ? selectedOrganization.employer : [];
      if (!this.employers.some(n => n.id === permission.employer_id)) {
        permission.employer_id = null;
        if ( permission.departments) {
          const a = new UserUnitPermission();
          a.employer_id = permission.employer_id;
          a.organization_id = permission.organization_id;
          this.user.units[index] = a;
        }
      }
      return this.employers;
    }
    this.employers = [];
    return [];
  }

  selectedDepartment(permission: UserUnitPermission): Department[] {
    const selectedEmployer = this.employers;

    if (selectedEmployer) {
      const selectedDepartment = (<Employer[]>selectedEmployer).find(e => {
        return +e.id === +permission.employer_id;
      });
      if (selectedDepartment) {
        return selectedDepartment.department;
      }
    }
    return [];
  }

  submit(form: NgForm): void {
    this.hasServerError = false;
    if (form.valid) {
      if (this.user.modules.some(m => m.isEnabled) &&
        ((this.user.units.length > 0 && this.user.units[0].organization_id) || this.user.role === 'admin')) {
        if (this.user.id) {
          this.userService.updateUser(this.user, this.user.id).then(response => this.handleResponse(response));
        } else {
          this.userService.saveNewUser(this.user).then(response => this.handleResponse(response));
        }
      }
    }
  }

  addUnitPermissionRow(): void {
    this.user.units.push(new UserUnitPermission());
  }

  removeUnitPermissionRow(index: number): void {
    this.user.units.splice(index, 1);
  }

  private handleResponse(isSaved: any): void {
    this.message = isSaved['message'];
    if (this.message === 'username_exist') {
      this.hasServerError = true;
      this.message = 'שם משתמש קיים';
    } else {
      if (this.message === 'failed') {
        this.hasServerError = true;
        this.message = 'שגיאת שרת, נסה שנית או צור קשר.';
      } else {
        this.router.navigate(['platform', 'settings', 'users']);
      }
    }
  }

  back(): void {
    this.router.navigate(['platform', 'settings', 'users']);
  }
}
