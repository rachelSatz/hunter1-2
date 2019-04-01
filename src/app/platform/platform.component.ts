import { Component, OnInit } from '@angular/core';
import {Router, NavigationStart, NavigationEnd} from '@angular/router';

import { UserSessionService } from 'app/shared/_services/user-session.service';
import { OrganizationService } from 'app/shared/_services/http/organization.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { fade, slideInOut } from 'app/shared/_animations/animation';
import { TimerService } from '../shared/_services/http/timer';
import { OperatorTasksService } from '../shared/_services/http/operator-tasks';
import { TaskTimerLabels } from '../shared/_models/timer.model';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.css'],
  animations: [ fade , slideInOut ]
})
export class PlatformComponent implements OnInit {

  activeUrl: string;
  organizations = [];
  employers = [];
  departments = [];
  organizationId: number;
  employerId: any;
  departmentId: any;
  agentBarActive = true;
  isAgent = false;

  // timer
  seconds: string;
  minutes: string;
  hours: string;
  showTimer = true;
  timerText = '';
  browserRefresh = false;
  readonly agentBarEl = [
    { id: 1, icon: 'building', label: 'ארגונים', link: 'organizations', role: 'admin'},
    { id: 2, icon: 'question-circle', label: 'תור עבודה', link: 'work-queue', role: 'operator'},
    { id: 3, icon: 'list-ul', label: 'משימות', link: 'tasks', role: 'operator'},
    { id: 4, icon: 'user', label: 'מעסיקים', link: 'employers', role: 'operator'},
    { id: 5, icon: 'users', label: 'משתמשים', link: 'users', role: 'admin'},
    { id: 6, icon: 'file', label: 'מסמכים', link: 'documents' , role: 'operator'},
    { id: 7, icon: 'user', label: 'אנשי קשר', link: 'contacts', role: 'operator'},
    { id: 8, icon: 'bell', label: 'התראות', link: '', role: 'operator'},
    { id: 9, icon: 'th', label: 'קופות', link: 'products', role: 'admin'},
    { id: 10, icon: 'tasks', label: 'הגדרות מנהל', link: 'plans', role: 'admin'}
  ];

  readonly menuLinks = [
        { url: 'dashboard',     label: 'דף הבית' },
        { url: 'compensations', label: 'יתרות לפיצויים', subMenuLinks: [
        { url: 'process', label: 'מעקב יתרות לפיצויים' },
        { url: 'deposits-report', label: 'מעקב דוח הפקדות' },
        { url: 'dashboard', label: 'מצג סטטוסים' }
      ]},
    { url: 'process', label: 'תהליכים', subMenuLinks: [
      { url: 'new/0', label: 'צור תהליך חדש' },
      { url: 'table', label: 'תהליכים' }
    ]},
    { url: 'feedback',    label: 'תשלומים והיזונים', subMenuLinks: [
      { url: 'employees', label: 'לפי עובד' },
      { url: 'files',     label: 'לפי קובץ' }
    ]},
    { url: 'finance',     label: 'פיננסים', subMenuLinks: [
      { url: 'invoices',  label: 'חשבונות חייבים' }
    ]},
    { url: 'settings',    label: 'הגדרות', subMenuLinks: [
      { url: 'employers', label: 'מעסיקים' },
      { url: 'contacts',  label: 'אנשי קשר' },
      ]},
  ];

  private _is_Employer: boolean;

  constructor(private router: Router,
              private userSession: UserSessionService,
              private organizationService: OrganizationService,
              public selectUnit: SelectUnitService,
              public helpers: HelpersService,
              public timerService: TimerService,
              private operatorTasks: OperatorTasksService) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        if (Object.values(TaskTimerLabels).some(a => a === val.url)) {
          this.timerService.reset();
          this.dispalyTimer(val.url, '');
        } else if (this.selectUnit.getTaskTimer() !== 0) {
          this.timerEvents();
        }
      }
      if (val instanceof NavigationEnd) {
        const a = router.routerState;
        this.dispalyTimer(val.url, val.urlAfterRedirects);
      }
    });
  }

  ngOnInit() {
    if (this.selectUnit.getTaskTimer() !== 0) {
      this.timerEvents();
    } else {
      this.showTimer = false;
    }

    this.isAgent =  this.userSession.getRole() !== 'employer';
    this.organizations = this.selectUnit.getOrganization();
    this.selectUnit.getEntityStorage();
    if (!this.selectUnit.currentOrganizationID) {
      this.getOrganizations(false);
    } else {
      this.organizationId = this.selectUnit.currentOrganizationID;
      this.employerId = this.selectUnit.currentEmployerID;
      this.departmentId = this.selectUnit.currentDepartmentID;
    }

    this.setActiveUrl(this.router.url);


    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.setActiveUrl(event.url);
      }
    });
  }
  timerEvents(): void {
    this.timerText =  this.selectUnit.getTaskTimer()['text'];
    this.intervals();
    this.dispalyTimer(this.router.routerState.snapshot.url, '');
  }

  dispalyTimer(url: string, urlAfterRedirects: string): void {
    if (this.selectUnit.getTaskTimer() !== 0) {
      if (Object.values(TaskTimerLabels).some(a => a === url)) {
        this.showTimer = false;
      }  else if (url === '/platform/operator/work-queue' && urlAfterRedirects === '/platform/operator/work-queue') {
        this.showTimer = false;
      } else if (this.browserRefresh) {
        this.showTimer = false;
      } else {
        this.showTimer = true;
      }
    } else {
      this.showTimer = false;
    }

  }
  intervals(): void {
    this.timerService.getSecondsObservable().subscribe(val => {
      if (val < 10) {
        this.seconds = '0' + val.toString();
      } else {
        this.seconds = val.toString();
      }
    });
    this.timerService.getMinutesObservable().subscribe(val => {
      if (val < 10) {
        this.minutes = '0' + val.toString();
      } else {
        this.minutes = val.toString();
      }
    });
    this.timerService.getHoursObservable().subscribe(val => {
      if (val < 10) {
        this.hours = '0' + val.toString();
      } else {
        this.hours = val.toString();
      }
    });
  }
  restNav(): void {
    this.agentBarActive = !this.agentBarActive;
    if (this.agentBarActive ) {
        this.selectUnit.changeOrganizationEmployerDepartment
        (this.organizationId, this.employerId['id'] || this.employerId['id'] === 0
          ? this.employerId['id'] : this.employerId  ,
          this.departmentId['id'] || this.departmentId['id'] === 0  ? this.departmentId['id'] : this.departmentId);
    } else {
      this.selectUnit.changeOrganizationEmployerDepartment(0, 0, 0);
    }
  }

  getOrganizations(is_loadEmployer: boolean, is_Employer?: boolean): void {
    this._is_Employer = is_Employer;
    this.helpers.setPageSpinner(true);
    this.organizationService.getOrganizations().then(response => {
      this.selectUnit.setOrganization(response);
      this.organizations = response;
      if (!this._is_Employer) {
        this.organizationId = response.length > 0 ? response[0].id : 0;
      }
      if (!is_loadEmployer) {
        this.helpers.setPageSpinner(false);
      } else {
        this.loadEmployers(this.organizationId);
      }
    });
  }

  private setActiveUrl(url: string): void {
    this.activeUrl = url.split('/')[2];
  }

  getImage(link: Object): string {
    const image = link['image'] ? link['image'] : link['url'];
    const color = link['url'] === this.activeUrl ? 'blue' : 'gray';
    return '/assets/img/menu/' + image + '-' + color + '.svg';
  }

  logout(): void {
    this.userSession.logout();
    this.selectUnit.logout();
    this.selectUnit.changeOrganizationEmployerDepartment(0, 0, 0);
    this.router.navigate(['/']);
  }

  loadEmployers(organizationID: number): void {
    this.employers = this.selectUnit.getOrganization().find(o => o.id === organizationID).employer;
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
    this.loadDepartments(this.employerId['id'] ? this.employerId['id'] : 0);
  }

  loadDepartments(employerID: number): void {
    if (employerID > 0) {
      this.employers = this.selectUnit.getOrganization().find(o => o.id === this.organizationId).employer;
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
      // this.selectUnit.changeEmployersDepartments(this.employers, this.departments);
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
      this.activeUrl = 'settings';
      return;
    } else {
      if (subLink === 'new/0') {
        this.router.navigate(['/platform', link, 'new', 0]);
      } else {
      this.router.navigate(['/platform', link, subLink]);
      }
    }
  }

  checkRole(role) {
    if (role === this.userSession.getRole() || this.userSession.getRole() === 'admin') {
      return true;
    } else {
      return false;
    }
  }

  stopTimer(): void {
    const time = this.hours + ':' + this.minutes + ':' + this.seconds;
    this.updateTaskTimer(time);
    this.timerService.reset();
    this.selectUnit.clearTaskTimer();
    this.router.navigate(['platform', 'operator', 'work-queue']);
  }

  updateTaskTimer(duration: string): void {
    if (this.selectUnit.getTaskTimer()['id'] > 0) {
      this.operatorTasks.updateTaskTimer(this.selectUnit.getTaskTimer()['id'], duration).then(
        response => response);
    }
  }
}
