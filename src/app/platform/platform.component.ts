import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { UserSessionService } from 'app/shared/_services/user-session.service';
import { OrganizationService } from 'app/shared/_services/http/organization.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { fade, slideInOut } from 'app/shared/_animations/animation';
import {TimerService} from '../shared/_services/http/timer';
import {OperatorTasksService} from '../shared/_services/http/operator-tasks';

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
  employerId: object;
  departmentId: object;
  agentBarActive = true;
  isAgent = false;

  // timer
  seconds: string;
  minutes: string;
  hours: string;
  show = false;
  task_timer_id: number;

  readonly agentBarEl = [
    { id: 1, icon: 'building', label: 'ארגונים', link: 'organizations', role: 'admin'},
    { id: 2, icon: 'question-circle', label: 'תור עבודה', link: 'work-queue', role: 'operator'},
    { id: 3, icon: 'list-ul', label: 'משימות', link: 'tasks', role: 'operator'},
    { id: 4, icon: 'user', label: 'מעסיקים', link: 'employers', role: 'operator'},
    { id: 5, icon: 'users', label: 'משתמשים', link: 'users', role: 'admin'},
    { id: 6, icon: 'file', label: 'מסמכים', link: '', role: 'operator'},
    { id: 7, icon: 'user', label: 'אנשי קשר', link: 'contacts', role: 'operator'},
    { id: 8, icon: 'bell', label: 'התראות', link: '', role: 'operator'}
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
              private selectUnit: SelectUnitService,
              public helpers: HelpersService,
              public timerService: TimerService,
              private operatorTasks: OperatorTasksService) {}

  ngOnInit() {
    this.intervals();
    this.seconds =  this.timerService.second.toString();
    // this.timerService.getSecondsObservable().subscribe(val => {
    //   if (val < 10) {
    //     this.seconds = '0' + val.toString();
    //   } else {
    //     this.seconds = val.toString();
    //   }
    // });
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
    this.activeUrl = url.split('/')[2];
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
    if (this.userSession.roleName === 'admin') {
      return true;
    } else {
      return role !== 'admin';
    }
  }
  intervals(): void {
    if (this.timerService.second.value > 0) {
      this.show = true;
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
  }
  stopTimer(): void {
    const time = this.hours + ':' + this.minutes + ':' + this.seconds;
    this.updateTaskTimer(time);
    this.timerService.reset();
    this.router.navigate(['platform', 'operator', 'work-queue']);
  }

  updateTaskTimer(duration: string): void {
    if (this.task_timer_id > 0) {
      this.operatorTasks.updateTaskTimer(this.task_timer_id, duration).then(
        response => response);
    }
  }
}
