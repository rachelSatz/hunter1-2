import { Component, OnInit } from '@angular/core';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { OrganizationService } from 'app/shared/_services/http/organization.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {

  organizations = [];
  departments = [];
  employers = [];
  role = [{'id': 1, 'name': 'מנהל'}, {'id': 2, 'name': 'מתפעל'}, {'id': 3, 'name': 'מעסיק'}];
  constructor(private employerService: EmployerService
    , private organizationService: OrganizationService
  ) { }

  ngOnInit() {
    this.organizationService.getOrganization().then(response => this.organizations = response);
  }

  loadEmployers(organizationID: number): void {
    this.organizationService.getEmployers(organizationID).then(response => this.employers = response);
  }

  loadDepartments(employerID: number): void {
    this.employerService.getDepartments(employerID).then(response => this.departments = response);
  }

}
