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
  styles: [`.check-module { width: 140px; }` ],
  animations: [ fade ]
})
export class UserFormComponent implements OnInit {

  user = new User(null);
  hasServerError: boolean;
  organizations = [];
  departments = [];
  employers = [];
  employees = [];

  moduleTypes = ModuleTypes;

  roles = Object.keys(EntityRoles).map(function(e) {
    return { id: e, name: EntityRoles[e] };
  });

  constructor(private route: ActivatedRoute, private employerService: EmployerService,
              private router: Router,
              private userService: UserService, private organizationService: OrganizationService
              ) {}

  ngOnInit() {
    this.organizationService.getOrganizations().then(response => this.organizations = response);
    if (this.route.snapshot.data.user) {
      this.user = new User(this.route.snapshot.data.user);
    }
  }

  selectedEmployer(organizationID: number): Employer[] {
    const selectedOrganization = this.organizations.find(o => {
      return +o.id === +organizationID;
    });
    return selectedOrganization ? selectedOrganization.employer : [];
  }

  selectedDepartment(organizationID: number, employerID: number): Department[] {
     const selectedEmployer = this.selectedEmployer(organizationID);

     if (selectedEmployer) {
       const selectedDepartment  = (<Employer[]>selectedEmployer).find(e => {
       return +e.id === +employerID;
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
      if (this.user.id) {
        this.userService.updateUser(this.user, this.user.id).then(response => this.handleResponse(response));
      } else {
        this.userService.saveNewUser(this.user).then(response => this.handleResponse(response));
      }
    }
  }

  addUnitPermissionRow(): void {
    this.user.units.push(new UserUnitPermission());
  }

  removeUnitPermissionRow(index: number): void {
    this.user.units.splice(index, 1);
  }

  private handleResponse(isSaved: boolean): void {
    if (isSaved) {
      this.router.navigate(['platform', 'settings', 'users']);
    } else {
      this.hasServerError = true;
    }
  }
}
