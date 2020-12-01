import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employer } from '../shared/_models/employer.model';
import { SelectUnitService } from '../shared/_services/select-unit.service';
import { EmployerService } from '../shared/_services/http/employer.service';
import { GeneralService } from '../shared/_services/http/general.service';
import { UserSessionService } from '../shared/_services/http/user-session.service';
import { Subscription } from 'rxjs';
import {OrganizationService} from '../shared/_services/http/organization.service';
import {Organization} from '../shared/_models/organization';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.css']
})
export class PlatformComponent implements OnInit {
  activeUrl: string;
  readonly menuLinks = [
    { url: 'dashboard' , label: 'נתונים פיננסים'},
    { url: 'employers' , label: 'לקוחות'},
    { url: 'finance' , label: 'פיננסים',  subMenuLinks:[
        { url: 'invoices', label: 'חשבונות חייבים' },
        { url: 'calc-processes', label: 'תהליכי חישוב' }
        // { url: 'employers-id-display', label: 'מצג מעסיקים' }
      ]},
    { url: 'users' , label: 'משתמשים'},
  ];
  projectGroupId: any;
  currProjectGroupId: any;
  employerId: any;
  currEmployerId: any;
  projectGroups = [{id: 1, name: 'smarti'}];
// , { id: 2, name: 'myHr'}
  employers = [];
  organizations: Organization[] = [];
  sub = new Subscription;
  organizationId: any;
  currOrganizationId: any;
  constructor(private EmployerService: EmployerService,
              private router: Router,
              private route: ActivatedRoute,
              public selectUnit: SelectUnitService,
              private GeneralService: GeneralService,
              private UserSessionService: UserSessionService,
              private ref: ChangeDetectorRef,
              private OrganizationService: OrganizationService) { }

  ngOnInit() {
    if (this.selectUnit.getProjectGroupId() && this.selectUnit.getEmployerID() && this.selectUnit.getOrganizationID()) {
      this.fetchItems();
    } else {
      this.selectUnit.setProjectGroupId(1);
      this.projectGroupId = this.selectUnit.getProjectGroupId();
    }

    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
       this.employerId = this.selectUnit.getEmployerID() ? this.selectUnit.getEmployerID() : 1 ;
        this.ref.detectChanges();
      }
    ));
  }

  fetchItems(): void {
    this.projectGroupId = this.currProjectGroupId =  this.selectUnit.getProjectGroupId();
    this.organizationId = this.currOrganizationId =  this.selectUnit.getOrganizationID();
    this.employerId = this.currEmployerId = this.selectUnit.getEmployerID();
    this.OrganizationService.getOrganizationByProjectGroupId(this.projectGroupId)
      .then(response => { this.organizations = response['data'];

        this.EmployerService.getEmployersByOrganizationId(this.organizationId)
          .then(res => { this.employers = res['data'];
          if (this.employers.length > 1) {
            this.employers.push({ id: '0', name: 'כלל המעסיקים' });
            this.employers.sort((a, b) => a.id - b.id);
          }});
      });
  }
  setActiveUrl(url: string): void {
    this.selectUnit.setActiveUrl(url);
  }
  selectEmployer(employerId: number): void {
    this.currEmployerId = employerId;
    this.selectUnit.setEmployerID(employerId);
  }

  loadOrganization(projectGroupId: number): void {
    if (projectGroupId !== this.currProjectGroupId) {
      this.currProjectGroupId = projectGroupId;
      this.selectUnit.setProjectGroupId(projectGroupId);
      this.OrganizationService.getOrganizationByProjectGroupId(projectGroupId)
        .then(response => {
          console.log(response);
          this.organizations = response['data'];
          this.organizationId =  this.organizations ? this.organizations[0].id : 0;
          this.selectUnit.setOrganizationID(this.organizationId);
          if (this.organizations.length === 0) {
            this.employers = [];
            this.employerId = 0;
            this.selectUnit.setEmployerID(this.employerId);
          }
        });
    }
  }
  loadEmployers(organizationId): void {
    if (organizationId !== this.currOrganizationId) {
      this.currOrganizationId = organizationId;
      this.selectUnit.setOrganizationID(this.organizationId);
      this.EmployerService.getEmployersByOrganizationId(organizationId).then(res => {
        this.employers = res['data'];
        if (this.employers.length > 1) {
          this.employers.push({ id: '0', name: 'כלל המעסיקים' });
          this.employers.sort((a, b) => a.id - b.id);
          console.log(this.employers);
          this.employerId = this.employers[0].id;
          this.selectUnit.setEmployerID(this.employerId);
          console.log(this.employerId);
        } else {
          this.employerId = this.employers[0] ? this.employers[0].id : 0;
          this.selectUnit.setEmployerID(this.employerId);
        }
      });
    }


  }
  navigate(link, subLink) {
        this.router.navigate(['/platform', link, subLink]);
        this.activeUrl = link;
  }
}
