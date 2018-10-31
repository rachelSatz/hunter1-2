import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import {Employer} from '../../_models/employer.model';
import {Organization} from '../../_models/organization.model';

@Injectable()
export class OrganizationService extends BaseHttpService {

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  readonly endPoint = this.apiUrl + '/organizations';


  getOrganization(): Promise<Organization[]> {
    return this.http.get(this.endPoint, this.getTokenHeader())
      .toPromise()
      .then(response => response as Organization[])
      .catch(() => []);
  }

  getEmployers(organizationID: number): Promise<Employer[]> {
    return this.http.get(this.endPoint + '/' + organizationID + '/' + 'employers' , this.getTokenHeader())
      .toPromise()
      .then(response => response as Employer[])
      .catch(() => []);
  }


}
