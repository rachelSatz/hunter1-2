import { Component, OnInit } from '@angular/core';
import {OrganizationService} from '../../../shared/_services/http/organization.service';
import {EmployerService} from '../../../shared/_services/http/employer.service';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';
import {DatePipe} from '@angular/common';
import {HelpersService} from '../../../shared/_services/helpers.service';
import {ReportFilters, ReportsData} from '../../../shared/_models/report_manage';
import {ActivatedRoute, Router} from '@angular/router';
import { MONTHS } from 'app/shared/_const/months';


@Component({
  selector: 'app-reports-manager',
  templateUrl: './reports-manager.component.html',
  styleUrls: ['./reports-manager.component.css']
})
export class ReportsManagerComponent implements OnInit {
  departmentsIds;
  reportsFilters= new ReportFilters;
  reportsData = new ReportsData();
  organizations = [];
  projects = [];
  operators = [];
  employers = [];
  departments = [];
  toDay = new Date();
  salaryMonth = false;
  startDate;
  startYear;
  endDate;
  endYear;
  departmentId;
  operatorId;
  projectsId;
  organizationId;
  employerId ;
  year = new Date().getFullYear();
  years = [ this.year, (this.year - 1) , (this.year - 2), (this.year - 3)];
  months = MONTHS;

  constructor(
    public datePipe: DatePipe,
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
    this.helpers.setPageSpinner(false);
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
    this.employers = (this.selectUnit.getOrganization()).find(o => o.id === this.organizationId).employer;
  }

  clear(): void {
    this.insetData();
  }

  submit(): void {
    this.helpers.setPageSpinner(true);
    const sDate = this.salaryMonth ? new Date(this.startYear, this.startDate, 1) : this.startDate;
    const eDate = this.salaryMonth ? new Date(this.endYear, this.endDate, 29) : this.endDate;
    this.startDate = this.datePipe.transform(sDate, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(eDate, 'yyyy-MM-dd');
    this.insertReportsFilters();
     this.organizationService.getReport(this.reportsFilters).then(response => {
       this.reportsData = response['reportsData'];
       this.departmentsIds = response['departmentsIds'];
       this.helpers.setPageSpinner(false);
     });
  }

  insertReportsFilters(): void {
    this.reportsFilters.projectsId = this.projectsId;
    this.reportsFilters.operatorId = this.operatorId;
    this.reportsFilters.organizationId = this.organizationId;
    this.reportsFilters.employerId = this.employerId;
    this.reportsFilters.departmentId = this.departmentId;
    // this.reportsFilters.salaryMonth = this.salaryMonth;
    this.reportsFilters.startDate = this.startDate;
    this.reportsFilters.endDate = this.endDate;
    this.selectUnit.setReportFilters(this.reportsFilters);
  }
  navigateEmployer(): void {
    if (this.departmentsIds) {
      this.insertReportsFilters();
      this.router.navigate(['/platform', 'operator', 'employers'],
        {queryParams: { report: 'report'}});
    }
  }

  openEmployeeIdsCount(): void {
    if (this.departmentsIds) {
      this.insertReportsFilters();
      this.router.navigate(['/platform', 'operator', 'employer-employees']);
    }
  }
}
