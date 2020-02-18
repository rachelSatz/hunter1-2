import { Component, OnInit } from '@angular/core';
import {OrganizationService} from '../../../shared/_services/http/organization.service';
import {EmployerService} from '../../../shared/_services/http/employer.service';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';
import {DatePipe} from '@angular/common';
import {HelpersService} from '../../../shared/_services/helpers.service';
import {ReportsData} from '../../../shared/_models/report_manage';

@Component({
  selector: 'app-reports-manager',
  templateUrl: './reports-manager.component.html',
  styleUrls: ['./reports-manager.component.css']
})
export class ReportsManagerComponent implements OnInit {
  reportsData: ReportsData;
  organizations = [];
  projects = [];
  operators = [];
  employers = [];
  departments = [];
  toDay = new Date();
  startDate;
  endDate;
  departmentId = 0;
  operatorId = 0;
  projectsId = 0;
  organizationId = 0;
  employerId = 0;

  constructor(
    private datePipe: DatePipe,
    private organizationService: OrganizationService,
    private employerService: EmployerService,
    private selectUnit: SelectUnitService,
    private helpers: HelpersService
  ) { }

  ngOnInit() {
    this.helpers.setPageSpinner(true);
    this.startDate = this.datePipe.transform(new Date(2018, 0o1, 0o1), 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.employerService.getProjects().then(response => this.projects = response);
    this.employerService.getOperator().then(response => this.operators = response);
    this.organizationService.getOrganizationsNameAndId().then(response => this.organizations = response);
    this.organizationService.getReport(this.organizationId , this.projectsId, this.employerId , this.operatorId, this.startDate,
      this.endDate).then( response => {
        this.reportsData = response['reportsData'];
        this.helpers.setPageSpinner(false);
    });
  }

  getOrganizations() {
     this.organizationService.getOrganizationByOperator(this.operatorId, this.projectsId).then(
       response => this.organizations = response);
  }

  getOperatorByProject() {
    this.employerService.getOperator(true, this.projectsId).then(
      response => this.operators = response
    );
  }

  getDepartment() {
    this.departments = this.employers[0].department;
  }

  getEmployers() {
    this.employers = (this.selectUnit.getOrganization()).find(o => o.id == this.organizationId).employer;
  }

  submit() {
    this.helpers.setPageSpinner(true)
    this.startDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');
     this.organizationService.getReport(this.organizationId , this.projectsId, this.employerId , this.operatorId, this.startDate,
      this.endDate).then(response => {
       this.reportsData = response['reportsData'];
       this.helpers.setPageSpinner(false);
     });
  }
}
