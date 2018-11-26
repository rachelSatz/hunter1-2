import {ActivatedRoute, Router} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { UserService } from 'app/shared/_services/http/user.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { OrganizationService } from 'app/shared/_services/http/organization.service';

import { User } from 'app/shared/_models/user.model';
import { UserUnitPermission } from 'app/shared/_models/user-unit-permission.model';
import { EntityRoles } from 'app/shared/_models/user.model';
import { ModuleTypes, UserModule } from 'app/shared/_models/user-module.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styles: [`.check-module { width: 140px; }`],
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        opacity: 0
      })),
      state('active', style({
        display: '*',
        opacity: 1
      })),
      transition('active => inactive', animate('200ms')),
      transition('inactive => active', animate('200ms'))
    ])
  ]
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
              private userService: UserService, private organizationService: OrganizationService) {}

  ngOnInit() {
    this.organizationService.getOrganizations().then(response => this.organizations = response);
    if (this.route.snapshot.data.user) {
      this.user = new User(this.route.snapshot.data.user);
    }
  }

  loadEmployers(organizationID: number): void {
    this.employerService.getEmployers(organizationID).then(response => this.employers = response);
  }

  loadDepartments(employerID: number): void {
    this.employerService.getDepartments(employerID).then(response => this.departments = response);
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
