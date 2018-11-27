import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { UserSessionService } from '../shared/_services/user-session.service';
import { OrganizationService } from 'app/shared/_services/http/organization.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.css']
})
export class PlatformComponent implements OnInit {

  activeUrl: string;
  organizations = [];
  employers = [];
  organizationId: number;
  employerId: number;

  readonly menuLinks = [
    { url: 'dashboard', label: 'דף הבית' },
    { url: 'compensations', label: 'יתרות לפיצויים', subMenuLinks: [
        { url: 'process', label: 'מעקב יתרות לפיצויים' },
        { url: 'dashboard', label: 'מצג סטטוסים' }
      ]},
    // { url: 'process', label: 'תהליכים', subMenuLinks: [
    //   { url: 'new', label: 'צור תהליך חדש' },
    //   { url: 'table', label: 'תהליכים' }
    // ]},
    // { url: 'feedback', label: 'היזונים חוזרים', subMenuLinks: [
    //   { url: 'graph', label: 'גרף' },
    //   { url: 'table/employees', label: 'טבלת עובדים' },
    //   { url: 'table/files', label: 'טבלת קבצים' }
    // ]},
    // { url: 'rejected', label: 'מעקב שגויים', subMenuLinks: [
    //   { url: 'employees', label: 'לפי עובד' },
    //   { url: 'files', label: 'לפי קובץ' }
    // ]},
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

  constructor(private router: Router, private userSession: UserSessionService,
              private organizationService: OrganizationService, private selectUnit: SelectUnitService,
              private employerService: EmployerService) {}

  ngOnInit() {
    this.organizationService.getOrganizations().then(response => {this.organizations = response;

    this.organizationId = this.organizations.length > 0 ?  this.organizations[0].id : 0;
    });
    this.setActiveUrl(this.router.url);

    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.setActiveUrl(event.url);
      }
    });
  }

  private setActiveUrl(url: string): void {
    if (url.substr(10).indexOf('/') !== -1) {
      this.activeUrl = url.substr(10, url.substr(10).indexOf('/'));
    } else {
      this.activeUrl = url.substr(10);
    }
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
    this.employerService.getEmployers(organizationID).then(response => {
      this.employers = response;
      if (this.employers.length > 0) {
        if (this.employers.length > 1) {
          this.employers.push({'id': 0, 'name': 'כלל המעסיקים'});
        }
        this.employers.sort((a, b) => a.id - b.id);
        this.employerId = this.employers.length > 0 ?  this.employers[0] : 0;
        this.selectUnit.changeOrganizationEmployer(organizationID, this.employerId['id']);
      }
    });
  }

  selectEmployer(employerID: number): void {
    this.selectUnit.changeEmployer(employerID);
  }
}
