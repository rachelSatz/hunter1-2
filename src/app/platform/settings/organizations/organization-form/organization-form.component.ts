import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import { OrganizationService } from 'app/shared/_services/http/organization.service';
import { PlatformComponent } from 'app/platform/platform.component';
import { Organization } from 'app/shared/_models/organization.model';

@Component({
  selector: 'app-organization-form',
  templateUrl: './organization-form.component.html'
})
export class OrganizationFormComponent implements OnInit {

  organization = new Organization();
  hasServerError: boolean;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private organizationService: OrganizationService,
              private  platformComponent: PlatformComponent,
              private _location: Location) {

  }

  ngOnInit() {
    if (this.route.snapshot.data.organization) {
      this.organization = this.route.snapshot.data.organization;
    }
  }

  submit(form: NgForm): void {
    this.hasServerError = false;

    if (form.valid) {
      if (this.organization.id) {
        this.organizationService.updateOrganization(form.value, this.organization.id).
        then(response => this.handleResponse(response));
      } else {
        this.organizationService.saveNewOrganization(form.value).then(response => {
          this.platformComponent.getOrganizations(false);
          this.handleResponse(response);
        });
      }
    }
  }

  private handleResponse(isSaved: boolean): void {
    if (isSaved) {
      this.previous();
    } else {
      this.hasServerError = true;
    }
  }

  previous(): void {
    this._location.back();
  }

}
