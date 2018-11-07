import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { OrganizationService } from '../_services/http/organization.service';
import { Organization } from '../_models/organization.model';

@Injectable()
export class OrganizationResolve implements Resolve<Organization> {

  constructor(private organizationService: OrganizationService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.organizationService.getOrganization(+snapshot.params.id).then(response => response as Organization);
  }
}
