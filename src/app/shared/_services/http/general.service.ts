import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from './user-session.service';
import { HttpClient } from '@angular/common/http';
import { Project } from '../../_models/project.model';
import {DataTableCriteria} from "../../data-table/classes/data-table-criteria";
import {DataTableResponse} from "../../data-table/classes/data-table-response";

@Injectable({
  providedIn: 'root'
})
export class GeneralService  extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/generals';
  projects: Project[] = [];

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getProjects(ProjectGroupID: number): Promise<Project[]> {
    return this.http.get(this.endPoint + '/projects?id=' + ProjectGroupID, this.getTokenHeader())
      .toPromise()
      .then(response => response as Project[])
      .catch(() => null);
  }

  get_financial_data(project_id, ifByMonth, month, fromDate, toDate, productTypeId, productGroupId, organizationId, employerId): Promise<any> {
    const request = this.getTokenHeader();
    if (ifByMonth) {
      request['params'] = { if_by_month: ifByMonth, month: month };
    } else {
      request['params'] = { if_by_month: ifByMonth, from_date: fromDate , to_date: toDate};
    }
    if (productTypeId !== 'all') {
      request['params']['product_type'] = productTypeId;
    }
    if (project_id !== 0 && project_id !== '0') {
      request['params']['project_id'] = project_id;
    }
    return this.http.get(this.endPoint + '/dashboard', request)
      .toPromise()
      .then(response => response as any)
      .catch(() => null);
  }
  // NeedToChargeEmployers(): Promise<any> {
  //   const request = this.getTokenHeader();
  //   if (criteria) {
  //     request['params'] = this.setDataTableParams(criteria);
  //   }
  //   if (noLimit) {
  //     request['params'] = {no_limit : noLimit};
  //   }
  //   return this.http.get(this.endPoint + '/NeedToChargeEmployers', request)
  //     .toPromise()
  //     .then(response => response as DataTableResponse)
  //     .catch(() => null);
  // }

  getEmployerComments(objectID: any, employerID: any): Promise<Object[]> {
    return this.http.post(this.apiUrl + '/generals' + '/getComments', {'username': objectID, 'employer':employerID},
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
    return this.http.delete(this.apiUrl + '/generals/remove' + objectID , this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
  getNeedToChargeEmployersTable(criteria?: DataTableCriteria, noLimit?: boolean): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }
    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }
    return this.http.get(this.endPoint + '/getNeedToChargeEmployersTable', request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }
}
