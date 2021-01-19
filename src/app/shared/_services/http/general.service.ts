import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from './user-session.service';
import { HttpClient } from '@angular/common/http';
import { Project } from '../../_models/project.model';
import { Bank } from '../../_models/bank.model';
import { SelectUnitService } from '../select-unit.service';
import { Dashboard } from '../../_models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class GeneralService  extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/generals';
  projects: Project[] = [];

  constructor(userSession: UserSessionService, private http: HttpClient, private selectUnit: SelectUnitService) {
    super(userSession);
  }

  getProjectGroupId() {
    return this.selectUnit.getProjectGroupId();
  }

  getProjects(ProjectGroupID: number): Promise<Project[]> {
    return this.http.get(this.endPoint + '/projects?id=' + ProjectGroupID, this.getTokenHeader())
      .toPromise()
      .then(response => response as Project[])
      .catch(() => null);
  }

  getProjectGroups(): Promise<Project[]> {
    return this.http.get(this.endPoint + '/projectGroups', this.getTokenHeader())
      .toPromise()
      .then(response => response as Project[])
      .catch(() => null);
  }

  get_financial_data(project_id, fromDate, toDate, productTypeId, organization_id, employer_id): Promise<Dashboard> {
    const request = this.getTokenHeader();
    request['params'] = { from_date: fromDate , to_date: toDate};
    if (productTypeId !== 'all') {
      request['params']['product_type'] = productTypeId;
    }
    if (+project_id !== 0 && project_id) {
      request['params']['project_id'] = project_id;
    }
    if (+organization_id !== 0 && organization_id) {
      request['params']['organization_id'] = organization_id;
    }
    if (+employer_id !== 0 && employer_id) {
      request['params']['employer_id'] = employer_id;
    }
    request['params']['project_group_id'] = this.getProjectGroupId();
    return this.http.get(this.endPoint + '/dashboard', request)
      .toPromise()
      .then(response => response as Dashboard)
      .catch(() => null);
  }

  getBanks(withBranches?: boolean): Promise<Bank[]> {
    const request = this.getTokenHeader();
    if (withBranches) {
      request['params'] = { withBranches: withBranches };
    }
    return this.http.get(this.endPoint + '/banks', request )
      .toPromise()
      .then(response => response as Bank[])
      .catch(() => []);
  }

  getEmployerComments(objectID: any, employerRelationID: any): Promise<Object[]> {
    return this.http.post(this.apiUrl + '/generals' + '/getComments', {'username': objectID, 'employer': employerRelationID},
      this.getTokenHeader())
      .toPromise()
      .then(response => response as Object[])
      .catch(() => []);
  }

  newEmployerComment(objectID: any, content: string, employer: any): Promise<boolean> {
    return this.http.post(this.apiUrl + '/generals' + '/comment',
      {'ids': objectID, 'content': content, 'content_type': 'comments', 'employer': employer}, this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  deleteComment(objectID: any): Promise<boolean> {
    return this.http.delete(this.apiUrl + '/generals/' + objectID , this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

}
