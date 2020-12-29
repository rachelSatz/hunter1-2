import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectUnitService } from '../shared/_services/select-unit.service';
import { EmployerService } from '../shared/_services/http/employer.service';
import { GeneralService } from '../shared/_services/http/general.service';
import { UserSessionService } from '../shared/_services/http/user-session.service';
import { Subscription } from 'rxjs';
import { OrganizationService } from '../shared/_services/http/organization.service';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.css']
})
export class PlatformComponent implements OnInit, OnDestroy {
  activeUrl: string;
  projectGroupId: any;
  currProjectGroupId: any;
  projectGroups: any;
  employers = [];
  sub = new Subscription;
  readonly menuLinks = [
    { url: 'dashboard' , label: 'נתונים פיננסים'},
    { url: 'employers' , label: 'לקוחות'},
    { url: 'finance' , label: 'פיננסים',  subMenuLinks: [
        { url: 'invoices', label: 'חשבונות חייבים' },
        { url: 'calc-processes', label: 'תהליכי חישוב' }
      ]},
    { url: 'users' , label: 'משתמשים'},
  ];


  constructor(private employerService: EmployerService,
              private router: Router,
              private route: ActivatedRoute,
              public selectUnit: SelectUnitService,
              private generalService: GeneralService,
              private userSessionService: UserSessionService,
              private ref: ChangeDetectorRef,
              private organizationService: OrganizationService) {
    this.employerService.getEmployers()
      .subscribe(res =>
        this.selectUnit.setEmployers(res['data'])
      );
  }

  ngOnInit() {
    this.projectGroups = this.userSessionService.getUserProjectGroups();
    if (!this.selectUnit.getProjectGroupId()) {
      this.selectUnit.setProjectGroupId(this.projectGroups[0].id);
    }
    this.projectGroupId = this.selectUnit.getProjectGroupId();
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
       this.ref.detectChanges();
      }
    ));
  }

  SendProjectGroup(event: any): void {
    this.currProjectGroupId = event;
    this.selectUnit.setProjectGroupId(this.currProjectGroupId);
  }

  // fetchItems(): void {
  //   this.projectGroupId = this.currProjectGroupId =  this.selectUnit.getProjectGroupId();
  //   // this.organizationId = this.currOrganizationId =  this.selectUnit.getOrganizationID();
  //   // this.employerId = this.currEmployerId = this.selectUnit.getEmployerID();
  //   this.organizationService.getOrganizationByProjectGroupId(this.projectGroupId)
  //     .then(response => { this.organizations = response['data'];
  //       this.employerService.getEmployersByOrganizationId(this.organizationId)
  //         .then(res => { this.employers = res['data'];
  //         if (this.employers.length > 1) {
  //           this.employers.push({ id: '0', name: 'כלל המעסיקים' });
  //           this.employers.sort((a, b) => a.id - b.id);
  //         }});
  //     });
  // }

  setActiveUrl(url: string): void {
    this.selectUnit.setActiveUrl(url);
  }

  // selectEmployer(employerId: number): void {
  //   this.currEmployerId = employerId;
  //   this.selectUnit.setEmployerID(employerId);
  // }

  // loadOrganization(projectGroupId: number): void {
  //   if (projectGroupId !== this.currProjectGroupId) {
  //     this.currProjectGroupId = projectGroupId;
  //     this.selectUnit.setProjectGroupId(projectGroupId);
  //     this.organizationService.getOrganizationByProjectGroupId(projectGroupId)
  //       .then(response => {
  //         console.log(response);
  //         this.organizations = response['data'];
  //         this.organizationId =  this.organizations ? this.organizations[0].id : 0;
  //         this.selectUnit.setOrganizationID(this.organizationId);
  //         if (this.organizations.length === 0) {
  //           this.employers = [];
  //           this.employerId = 0;
  //           this.selectUnit.setEmployerID(this.employerId);
  //         }
  //       });
  //   }
  // }


  // loadEmployers(organizationId): void {
  //   if (organizationId !== this.currOrganizationId) {
  //     this.currOrganizationId = organizationId;
  //     this.selectUnit.setOrganizationID(this.organizationId);
  //     this.employerService.getEmployersByOrganizationId(organizationId).then(res => {
  //       this.employers = res['data'];
  //       if (this.employers.length > 1) {
  //         this.employers.push({ id: '0', name: 'כלל המעסיקים' });
  //         this.employers.sort((a, b) => a.id - b.id);
  //         console.log(this.employers);
  //         this.employerId = this.employers[0].id;
  //         this.selectUnit.setEmployerID(this.employerId);
  //         console.log(this.employerId);
  //       } else {
  //         this.employerId = this.employers[0] ? this.employers[0].id : 0;
  //         this.selectUnit.setEmployerID(this.employerId);
  //       }
  //     });
  //   }
  // }

  navigate(link, subLink) {
        this.router.navigate(['/platform', link, subLink]);
        this.activeUrl = link;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
