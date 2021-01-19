import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from './user-session.service';
import { HttpClient } from '@angular/common/http';
import { Organization } from '../../_models/organization';
import { SelectUnitService } from '../select-unit.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/organization';

  constructor(userSession: UserSessionService, private http: HttpClient, private selectUnit: SelectUnitService) {
    super(userSession);
  }

  getProjectGroupId() {
    return this.selectUnit.getProjectGroupId();
  }

  getOrganization(): Promise<Organization[]> {
    const request = this.getTokenHeader();
    request['params'] = {};
    request['params']['project_group_id'] = this.getProjectGroupId();
    return this.http.get(this.endPoint , request)
      .toPromise()
      .then(response => response as Organization[])
      .catch(() => []);
  }

  getOrganizationByProjectId(project_id: number): Promise<Organization[]> {
    const request = this.getTokenHeader();
    request['params'] = {};
    request['params']['project_id'] = project_id;
    request['params']['project_group_id'] = this.getProjectGroupId();
    return this.http.get(this.endPoint , request)
      .toPromise()
      .then(response => response as Organization[])
      .catch(() => []);
  }
}
