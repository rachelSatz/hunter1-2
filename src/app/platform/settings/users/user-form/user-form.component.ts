import {ActivatedRoute, Router} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';

import { UserService } from 'app/shared/_services/http/user.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { OrganizationService } from 'app/shared/_services/http/organization.service';

import { User } from 'app/shared/_models/user.model';
import { Department } from 'app/shared/_models/department.model';
import { UserUnitPermission } from 'app/shared/_models/user-unit-permission.model';
import { EntityRoles } from 'app/shared/_models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {

  user = new User();
  hasServerError: boolean;
  entityRows = [{}];
  organizations = [];
  departments = [];
  employers = [];
  employees = [];

  role = Object.keys(EntityRoles).map(function(e) {
    return { id: e, name: EntityRoles[e] };
  });

  constructor(private route: ActivatedRoute, private employerService: EmployerService,
              private router: Router,
              private userService: UserService, private organizationService: OrganizationService) {}

  ngOnInit() {
    this.organizationService.getOrganizations().then(response => this.organizations = response);
    if (this.route.snapshot.data.user) {
      this.user = this.route.snapshot.data.user;
    }
  }

  loadEmployers(organizationID: number): void {
    this.organizationService.getEmployers(organizationID).then(response => this.employers = response);
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
    this.user.unit_permissions.push(new UserUnitPermission());
  }

  removeUnitPermissionRow(index: number): void {
    this.user.unit_permissions.splice(index, 1);
  }

  private handleResponse(isSaved: boolean): void {
    if (isSaved) {
      this.router.navigate(['platform', 'settings', 'users']);
    } else {
      this.hasServerError = true;
    }
  }
}
