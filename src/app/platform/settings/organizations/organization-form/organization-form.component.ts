import { Component, OnInit } from '@angular/core';
import { Organization } from '../../../../shared/_models/organization.model';
import {ActivatedRoute, Router} from '@angular/router';
import { NgForm } from '@angular/forms';
import { OrganizationService } from '../../../../shared/_services/http/organization.service';


@Component({
  selector: 'app-organization-form',
  templateUrl: './organization-form.component.html'
})
export class OrganizationFormComponent implements OnInit {

  organization = new Organization();
  hasServerError: boolean;
  constructor(private route: ActivatedRoute, private router: Router, private organizationService: OrganizationService) {

  }

  ngOnInit() {

    if (this.route.snapshot.data.organization) {
      this.organization = this.route.snapshot.data.organization;
    }else {
      this.handleResponse(true);
    }
  }

  submit(form: NgForm): void {
    this.hasServerError = false;

    if (form.valid) {
      if (this.organization.id) {
        this.organizationService.updateOrganization(form.value, this.organization.id).
        then(response => this.handleResponse(response));
      } else {
        this.organizationService.saveNewOrganization(form.value).then(response => this.handleResponse(response));
      }
    }
  }

  private handleResponse(isSaved: boolean): void {
    if (isSaved) {
      this.router.navigate(['platform', 'settings', 'organizations']);
    } else {
      this.hasServerError = true;
    }
  }

}
