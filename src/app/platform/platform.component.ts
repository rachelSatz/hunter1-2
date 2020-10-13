import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Employer } from '../shared/_models/employer.model';
import { HelpersService } from '../shared/_services/helpers.service';
import { SelectUnitService } from '../shared/_services/select-unit.service';
import { EmployerService } from '../shared/_services/http/employer.service';
import {GeneralService} from '../shared/_services/http/general.service';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.css']
})
export class PlatformComponent implements OnInit {

  activeUrl: string;
  readonly menuLinks = [
    { url: 'employers' , label: 'לקוחות'},
    { url: 'finance',  label: 'הגדרות'},
    { url: 'invoices' , label: 'פיננסים'},
    { url: 'users' , label: 'משתמשים'},
  ];
  organizationId: any;
  @Input() employerId: any;
  organizations = [{id: 1, name: 'smarti'}, { id: 2, name: 'myHr'}];
  employers: Employer[] = [];

  constructor(private EmployerService:EmployerService,
              private router:Router,
              private route: ActivatedRoute,
              private selectUnit:SelectUnitService,
              public helpers: HelpersService,
              private GeneralService: GeneralService) { }

  ngOnInit() {
    this.organizationId = this.selectUnit.getOrganization();
    this.employerId = this.selectUnit.getEmployerID();
    this.activeUrl = 'employers';
  }

  setActiveUrl(url: string): void {
    this.activeUrl =url;
  }
  selectEmployer(employerId: number): void{
    this.selectUnit.setEmployerID(employerId);
  }

  loadEmployers(organizationId: number): void {
    this.selectUnit.setOrganization(organizationId);
    this.GeneralService.getProjects(organizationId)
      .then(response=>
      {this.GeneralService.projects = response[(<string>this.organizationId)];
        console.log('ddd',this.GeneralService.projects );});
    if(organizationId == 1)
    {
      this.EmployerService.getEmployers().then(res => {
        this.employers = res['1'];
        console.log(this.employers);
      });
    }
    else {
      this.employers = [];
    }
  }
}
