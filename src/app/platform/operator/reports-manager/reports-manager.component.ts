import { Component, OnInit } from '@angular/core';
import {OrganizationService} from '../../../shared/_services/http/organization.service';
import {EmployerService} from '../../../shared/_services/http/employer.service';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';
import {DatePipe} from '@angular/common';
import {HelpersService} from '../../../shared/_services/helpers.service';
import {ReportFilters, ReportsData} from '../../../shared/_models/report_manage';
import {ActivatedRoute, Router} from '@angular/router';
import { MONTHS } from 'app/shared/_const/months';
import {TeamLeaderTask} from '../../../shared/_models/user.model';
import {UserService} from '../../../shared/_services/http/user.service';
import {NotificationService} from '../../../shared/_services/notification.service';


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
  teamLeader;
  organizationId;
  employerId ;
  format = 'MM-yyyy';
  year = new Date().getFullYear();
  years = [ this.year, (this.year - 1) , (this.year - 2), (this.year - 3)];
  months = MONTHS;

  teamLeaders = Object.keys(TeamLeaderTask).map(function (e) {
    return {id: e, name: TeamLeaderTask[e]};
  });


  constructor(
    public datePipe: DatePipe,
    private router: Router,
    protected route: ActivatedRoute,
    private organizationService: OrganizationService,
    protected notificationService: NotificationService,
    private employerService: EmployerService,
    private selectUnit: SelectUnitService,
    private userService: UserService,
    private helpers: HelpersService
  ) {   this.teamLeaders.push({'id': '0', 'name': 'כלל מנהלי התיק'});
  }

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
    this.teamLeader = 0;
    this.startDate = this.datePipe.transform(new Date(2018, 0o1, 0o1), 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.employerService.getProjects().then(response => this.projects = response);
    this.employerService.getOperator().then(response => this.operators = response);
    this.employerService.getEmployersName().then(response => this.employers = response);
    this.organizationService.getOrganizationsNameAndId().then(response => this.organizations = response);
    this.helpers.setPageSpinner(false);
  }

  setOperator(): void {
    if (this.teamLeader !== '0') {
      this.employerService.getOperatorByTeamLeader(this.teamLeader).then(
        response => {
          if (response) {
            this.operators = response;
          }
        });
    } else {
      this.employerService.getOperator().then(response => this.operators = response);
    }
  }

  getAllFilter(): void {
    this.employerService.filterReport(this.projectsId, this.operatorId, this.organizationId, this.employerId).then(response => {
      if (response) {
        this.projects = response['projects'];
        this.operators = response['operators'];
        this.organizations = response['organizations'];
        this.employers = response['employers'];
      }
    });
  }

  getDepartment(): void {
    this.departments = this.employers.find(e => e.id === this.employerId).department;
  }

  clear(): void {
    this.insetData();
  }

  submit(): void {
    this.helpers.setPageSpinner(true);
    const sDate = this.salaryMonth ? new Date(this.startYear, this.startDate - 1, 1) : this.startDate;
    const eDate = this.salaryMonth ? new Date(this.endYear, this.endDate - 1, 29) : this.endDate;
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
    this.reportsFilters.projectId = this.projectsId;
    this.reportsFilters.operatorId = this.operatorId;
    this.reportsFilters.organizationId = this.organizationId;
    this.reportsFilters.employerId = this.employerId;
    this.reportsFilters.teamLeader = this.teamLeader;
    this.reportsFilters.departmentId = this.departmentId;
    this.reportsFilters.salaryMonth = this.salaryMonth;
    this.reportsFilters.startDate = this.startDate;
    this.reportsFilters.endDate = this.endDate;
    this.selectUnit.setReportFilters(this.reportsFilters);
  }

  navigateProcess(): void {
    if (this.reportsFilters.employerId) {
      this.router.navigate(['/platform', 'process', 'table'],
        {queryParams:  {employerId: this.employerId}});
    } else {
      this.notificationService.error('יש לסנן עם מעסיק', '');
    }
  }

  navigateFeedback(status): void {
    if (this.reportsFilters.departmentId) {
      // this.reportsFilters.status = status;
      // this.selectUnit.setReportFilters(this.reportsFilters);
      // this.router.navigate(['/platform', 'feedback', 'files'],
      //   {queryParams:  {departmentId: this.departmentId}});
    } else {
      this.notificationService.error('יש לסנן עם מחלקה', '');
    }
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
