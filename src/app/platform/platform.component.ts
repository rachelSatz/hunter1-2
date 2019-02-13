import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { UserSessionService } from '../shared/_services/user-session.service';
import { OrganizationService } from 'app/shared/_services/http/organization.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { HelpersService } from 'app/shared/_services/helpers.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.css'],
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        opacity: '0'
      })),
      state('active', style({
        display: 'block',
        opacity: '1'
      })),
      transition('active => inactive', animate('100ms ease-in')),
      transition('inactive => active', animate('300ms ease-in'))
    ]),
    trigger('slideInOut', [
      state('in', style({
        display: 'none',
        width: '0',
        opacity: '0'
      })),
      state('out', style({
        display: 'block',
        width: '*',
        opacity: '1'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class PlatformComponent implements OnInit {

  activeUrl: string;
  organizations = [];
  employers = [];
  departments = [];
  organizationId: number;
  employerId: object;
  departmentId: object;
  agentBarActive = true;
  isAgent = false;

  readonly agentBarEl = [
    { id: 1, icon: 'question-circle' , label: 'תור עבודה', link: 'work-queue'},
    { id: 2, icon: 'list-ul' , label: 'משימות',    link: ''},
    { id: 3, icon: 'users' ,   label: 'מעסיקים',   link: 'employers'},
    { id: 4, icon: 'file' ,    label: 'מסמכים',    link: ''},
    { id: 5, icon: 'user' ,    label: 'אנשי קשר',  link: ''},
    { id: 6, icon: 'bell' ,    label: 'התראות',    link: ''}
    ];

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

  private _is_Employer: boolean;

  constructor(private router: Router,
              private userSession: UserSessionService,
              private organizationService: OrganizationService,
              private selectUnit: SelectUnitService,
              public helpers: HelpersService) {}

  ngOnInit() {
    this.isAgent =  this.userSession.roleName !== 'employer';
    this.getOrganizations(false);
    this.setActiveUrl(this.router.url);

    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.setActiveUrl(event.url);
      }
    });
  }

  getOrganizations(is_loadEmployer: boolean, is_Employer?: boolean): void {
    this._is_Employer = is_Employer;
    this.helpers.setPageSpinner(true);
    this.organizationService.getOrganizations().then(response => {
      this.helpers.organizations = response;
      if (!this._is_Employer) {
        this.organizationId = this.helpers.organizations.length > 0 ? this.helpers.organizations[0].id : 0;
      }
      if (!is_loadEmployer) {
        this.helpers.setPageSpinner(false);
      } else {
        this.loadEmployers(this.organizationId);
      }

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
    if (!this._is_Employer) {
      this.employerId = this.employers.length > 0 ? this.employers[0] : 0;
      this.organizationId = organizationID;
    }
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
    if (!this._is_Employer) {
      this.departmentId = this.departments.length > 0 ? this.departments[0] : 0;
      this.selectUnit.changeEmployersDepartments(this.employers, this.departments);
      this.selectUnit.changeOrganizationEmployerDepartment(this.organizationId, employerID,
        this.departments.length > 0 ? this.departmentId['id'] : 0);
    }
    this.helpers.setPageSpinner(false);
  }

  selectDepartment(departmentID: number): void {
    this.selectUnit.changeDepartment(departmentID);
  }

  navigate(link, subLink) {
    if ( subLink === 'employers' ||  subLink === 'contacts') {
     this.router.navigate(['/platform', subLink]);
      return;
    } else {
      if (subLink === 'new/0') {
        this.router.navigate(['/platform', link, 'new', 0]);
      } else {
      this.router.navigate(['/platform', link, subLink]);
      }
    }
  }
}
