import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from './user-session.service';
import { HttpClient } from '@angular/common/http';
import { Organization } from '../../_models/organization';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/organization';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getOrganizationByProjectGroupId(project_group_id: number): Promise<Organization[]> {
    const request = this.getTokenHeader();
    request['params'] = {};
    request['params']['project_group_id'] = project_group_id;
    return this.http.get(this.endPoint , request)
      .toPromise()
      .then(response => response as Organization[])
      .catch(() => []);
  }
  getOrganizationByProjectId(project_id: number): Promise<Organization[]> {
    const request = this.getTokenHeader();
    request['params'] = {};
    request['params']['project_id'] = project_id;
    return this.http.get(this.endPoint , request)
      .toPromise()
      .then(response => response as Organization[])
      .catch(() => []);
  }
}
