import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import { Employer } from '../shared/_models/employer.model';
import { HelpersService } from '../shared/_services/helpers.service';
import { SelectUnitService } from '../shared/_services/select-unit.service';
import { EmployerService } from '../shared/_services/http/employer.service';
import {GeneralService} from '../shared/_services/http/general.service';
import {UserSessionService} from '../shared/_services/http/user-session.service';
import {Subscription} from 'rxjs';

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
      ]},
    { url: 'users' , label: 'משתמשים'},
  ];
  organizationId: any;
  @Input() employerId: any;
  organizations = [{id: 1, name: 'smarti'}, { id: 2, name: 'myHr'}];
  employers: Employer[] = [];
  sub = new Subscription;


  constructor(private EmployerService:EmployerService,
              private router:Router,
              private route: ActivatedRoute,
              private selectUnit:SelectUnitService,
              public helpers: HelpersService,
              private GeneralService: GeneralService,
              private UserSessionService: UserSessionService) { }

  ngOnInit() {
    this.helpers.setPageSpinner(true);
    if(this.selectUnit.getOrganization()){
      this.organizationId =this.selectUnit.getOrganization();
    } else {
      this.selectUnit.setOrganization(1);
      this.organizationId =this.selectUnit.getOrganization();
    }
    this.loadEmployers(this.selectUnit.getOrganization());
    this.EmployerService.getEmployers().then(res => {
      this.employers = res['1'];
      this.employerId = this.selectUnit.getEmployerID() ?this.selectUnit.getEmployerID(): 1 ;
      this.activeUrl =this.selectUnit.getActiveUrl()? this.selectUnit.getActiveUrl(): 'dashboard';
    });
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
      this.activeUrl =this.selectUnit.getActiveUrl()? this.selectUnit.getActiveUrl(): 'dashboard';
      this.employerId = this.selectUnit.getEmployerID() ?this.selectUnit.getEmployerID(): 1 ;
      }
    ));
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.setActiveUrl(event.url);
      }
    });

    this.helpers.setPageSpinner(false);

  }

  setActiveUrl(url: string): void {
    this.activeUrl =url;
  }
  selectEmployer(employerId: number): void{
    this.selectUnit.setEmployerID(employerId);
  }

  loadEmployers(organizationId: number): void {
    this.selectUnit.setOrganization(organizationId);
    if(organizationId == 1)
    {
      this.EmployerService.getEmployers().then(res => {
        this.employers = res['1'];
        this.helpers.setPageSpinner(false);
      });
    }
    else {
      this.employers = [];
    }
  }
  navigate(link, subLink) {
        this.router.navigate(['/platform', link, subLink]);
        this.activeUrl = link;
  }
}
