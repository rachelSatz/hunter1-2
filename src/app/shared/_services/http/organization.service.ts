import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import { Organization } from '../../_models/organization.model';
import {DataTableResponse} from '../../data-table/classes/data-table-response';

@Injectable()
export class OrganizationService extends BaseHttpService {

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  readonly endPoint = this.apiUrl + '/organizations';


  getOrganizations(): Promise<Organization[]> {
    return this.http.get(this.endPoint + '/getOrganizations', this.getTokenHeader())
      .toPromise()
      .then(response => response as Organization[])
      .catch(() => null);
  }

  getOrganizationTable(): Promise<DataTableResponse> {
    return this.http.get(this.endPoint, this.getTokenHeader())
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getOrganizationsNameAndId(): Promise<Organization[]> {
    return this.http.get(this.endPoint + '/organizationsForSelector', this.getTokenHeader())
      .toPromise()
      .then(response => response as Organization[])
      .catch(() => []);
  }

  getOrganization(id: number): Promise<Organization> {
    return this.http.get(this.endPoint + '/' + id , this.getTokenHeader())
      .toPromise()
      .then(response => response as Organization)
      .catch(() => null);
  }

  saveNewOrganization(organization: Organization): Promise<boolean> {
    return this.http.post(this.endPoint, organization, this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  updateOrganization(organization: Organization, id: number): Promise<boolean> {
    return this.http.put(this.endPoint  + '/' + id, organization, this.getTokenHeader())
      .toPromise()
      .then(response => response as boolean);
  }

}
