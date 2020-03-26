import { Component, OnInit } from '@angular/core';
import {OrganizationService} from '../../../shared/_services/http/organization.service';
import {EmployerService} from '../../../shared/_services/http/employer.service';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';
import {DatePipe} from '@angular/common';
import {HelpersService} from '../../../shared/_services/helpers.service';
import {ReportsData} from '../../../shared/_models/report_manage';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-reports-manager',
  templateUrl: './reports-manager.component.html',
  styleUrls: ['./reports-manager.component.css']
})
export class ReportsManagerComponent implements OnInit {
  departmentsIds;
  reportsData = new ReportsData();
  organizations = [];
  projects = [];
  operators = [];
  employers = [];
  departments = [];
  toDay = new Date();
  startDate;
  endDate;
  departmentId;
  operatorId;
  projectsId;
  organizationId;
  employerId ;

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    protected route: ActivatedRoute,
    private organizationService: OrganizationService,
    private employerService: EmployerService,
    private selectUnit: SelectUnitService,
    private helpers: HelpersService
  ) { }

  ngOnInit() {
    this.helpers.setPageSpinner(true);
    this.insetData();
    this.organizationService.getReport(this.organizationId , this.projectsId, this.employerId , this.operatorId, this.startDate,
      this.endDate).then( response => {
        this.reportsData = response['reportsData'];
        this.departmentsIds = response['departmentsIds'];
        this.helpers.setPageSpinner(false);
    });
  }

  insetData() {
    this.departmentId = 0;
    this.operatorId = 0;
    this.projectsId = 0;
    this.organizationId = 0;
    this.employerId = 0;
    this.startDate = this.datePipe.transform(new Date(2018, 0o1, 0o1), 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.employerService.getProjects().then(response => this.projects = response);
    this.employerService.getOperator().then(response => this.operators = response);
    this.organizationService.getOrganizationsNameAndId().then(response => this.organizations = response);
  }

  getOrganizations(): void {
     this.organizationService.getOrganizationByOperator(this.operatorId, this.projectsId).then(
       response => this.organizations = response);
  }

  getOperatorByProject(): void {
    this.employerService.getOperator(true, this.projectsId).then(
      response => this.operators = response
    );
  }

  getDepartment(): void {
    this.departments = this.employers[0].department;
  }

  getEmployers(): void {
    this.employers = (this.selectUnit.getOrganization()).find(o => o.id == this.organizationId).employer;
  }

  clear(): void {
    this.insetData();
  }

  submit(): void {
    this.helpers.setPageSpinner(true);
    this.startDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');
     this.organizationService.getReport(this.organizationId , this.projectsId, this.employerId , this.operatorId, this.startDate,
      this.endDate).then(response => {
       this.reportsData = response['reportsData'];
       this.departmentsIds = response['departmentsIds'];
       this.helpers.setPageSpinner(false);
     });
  }

  navigateEmployer(): void {
    this.router.navigate(['/platform', 'operator', 'employers'],
      {queryParams: { operatorId: this.operatorId}});
  }

  openEmployeeIdsCount(): void {
    this.router.navigate(['/platform', 'operator', 'employer-employees'] , {relativeTo: this.route});
      // {queryParams: { departmentsIds: this.departmentsIds, startDate: this.startDate, endDate: this.endDate}});
  }
}
