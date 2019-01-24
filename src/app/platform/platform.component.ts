import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { UserSessionService } from '../shared/_services/user-session.service';
import { OrganizationService } from 'app/shared/_services/http/organization.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { HelpersService } from 'app/shared/_services/helpers.service';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.css']
})
export class PlatformComponent implements OnInit {

  activeUrl: string;
  organizations = [];
  employers = [];
  departments = [];
  organizationId: number;
  employerId: object;
  departmentId: object;

  readonly menuLinks = [
        { url: 'dashboard', label: 'דף הבית' },
        { url: 'compensations', label: 'יתרות לפיצויים', subMenuLinks: [
        { url: 'process', label: 'מעקב יתרות לפיצויים' },
        { url: 'dashboard', label: 'מצג סטטוסים' }
      ]},
    { url: 'process', label: 'תהליכים', subMenuLinks: [
      { url: 'new/0', label: 'צור תהליך חדש' },
      { url: 'table', label: 'תהליכים' }
    ]},
    // { url: 'feedback', label: 'היזונים חוזרים', subMenuLinks: [
    //   { url: 'graph', label: 'גרף' },
    //   { url: 'table/employees', label: 'טבלת עובדים' },
    //   { url: 'table/files', label: 'טבלת קבצים' }
    // ]},
    { url: 'feedback', label: 'תשלומים והיזונים', subMenuLinks: [
      { url: 'employees', label: 'לפי עובד' },
      { url: 'files', label: 'לפי קובץ' }
    ]},
    { url: 'finance', label: 'פיננסים', subMenuLinks: [
      { url: 'invoices', label: 'חשבונות חייבים' }
    ]},
    { url: 'settings', label: 'הגדרות', subMenuLinks: [
      // { url: 'employees', label: 'עובדים' },
      { url: 'organizations', label: 'ארגונים' },
      { url: 'employers', label: 'מעסיקים' },
      // { url: 'agents', label: 'סוכנים' },
      { url: 'contacts', label: 'אנשי קשר' },
      { url: 'users', label: 'משתמשים' }
      ]},
  ];

  constructor(private router: Router,
              private userSession: UserSessionService,
              private organizationService: OrganizationService,
              private selectUnit: SelectUnitService,
              public helpers: HelpersService) {}

  ngOnInit() {
    this.getOrganizations(false);
    this.setActiveUrl(this.router.url);

    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.setActiveUrl(event.url);
      }
    });
  }

  getOrganizations(is_loadEmployer: boolean): void {
    this.helpers.setPageSpinner(true);
    this.organizationService.getOrganizations().then(response => {
      this.helpers.organizations = response;
      this.organizationId = this.helpers.organizations.length > 0 ?  this.helpers.organizations[0].id : 0;
      if (is_loadEmployer) { this.loadEmployers(this.organizationId); } else {  this.helpers.setPageSpinner(false); }

    });
  }

  private setActiveUrl(url: string): void {
      this.activeUrl = url.substr(10).indexOf('/') !== -1 ? url.substr(10, url.substr(10).indexOf('/')) :
        this.activeUrl = url.substr(10);

  }

  getImage(link: Object): string {
    const image = link['image'] ? link['image'] : link['url'];
    const color = link['url'] === this.activeUrl ? 'blue' : 'gray';
    return '/assets/img/menu/' + image + '-' + color + '.svg';
  }

  logout(): void {
    this.userSession.logout();
    this.router.navigate(['/']);
  }

  loadEmployers(organizationID: number): void {
    this.employers = this.helpers.organizations.find(o => o.id === organizationID).employer;
    if (this.employers.length > 1) {
      if (!this.employers.some(e => e.id === 0)) {
        this.employers.push({'id': 0, 'name': 'כלל המעסיקים'});
      }
    }
    this.employers.sort((a, b) => a.id - b.id);
    this.employerId = this.employers.length > 0 ?  this.employers[0] : 0;
    this.organizationId = organizationID;
    // this.selectUnit.changeOrganizationEmployer(this.organizationId, this.employerId['id']);
    this.loadDepartments(this.employerId['id']);
  }

  loadDepartments(employerID: number): void {
    if (employerID > 0) {
      this.employers = this.helpers.organizations.find(o => o.id === this.organizationId).employer;
      this.departments = this.employers.find(e => e.id === employerID).department;
      if (this.departments.length > 1) {
        if (!this.departments.some(d => d.id === 0)) {
          this.departments.push({'id': 0, 'name': 'כלל המחלקות'});
        }
      }
      this.departments.sort((a, b) => a.id - b.id);
    }else {
      this.employerId = {'id': 0, 'name': 'כלל המעסיקים'};
      this.departments = [];
    }
    this.departmentId = this.departments.length > 0 ?  this.departments[0] : 0;
    this.selectUnit.changeEmployersDepartments(this.employers, this.departments);
    this.selectUnit.changeOrganizationEmployerDepartment(this.organizationId, employerID,
      this.departments.length > 0 ? this.departmentId['id'] : 0);
    this.helpers.setPageSpinner(false);
  }

  selectDepartment(departmentID: number): void {
    this.selectUnit.changeDepartment(departmentID);
  }
  test() {
    console.log('skdjflkjs');
  }
}
