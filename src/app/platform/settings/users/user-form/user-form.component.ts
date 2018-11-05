import {ActivatedRoute, Router} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';

import { UserService } from 'app/shared/_services/http/user.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { OrganizationService } from 'app/shared/_services/http/organization.service';

import { User } from 'app/shared/_models/user.model';
import {EntityRoles} from 'app/shared/_models/user.model';

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
  role = Object.keys(EntityRoles).map(function(e) {
    return { id: e, name: EntityRoles[e] };
  });

  constructor(private route: ActivatedRoute, private employerService: EmployerService, private userService: UserService
    , private organizationService: OrganizationService
  ) { }

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
      this.userService.updateUser(form.value, this.user.id).then(response => []);
    } else {
      this.userService.saveNewUser(form.value).then(response => []);
    }
  }
  }

  addEntityRow(): void {
    this.entityRows.push({});
  }

  deleteEntityRow(index: number): void {
    this.entityRows.splice(index, 1);
  }
}
