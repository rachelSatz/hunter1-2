import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from './user-session.service';
import { HttpClient } from '@angular/common/http';
import { Project } from '../../_models/project.model';

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

  get_financial_data(project_id, ifByMonth, month, fromDate, toDate): Promise<any> {
    const request = this.getTokenHeader();
    if (ifByMonth) {
      request['params'] = { project_id: project_id , if_by_month: ifByMonth, month: month };
    } else {
      request['params'] = { project_id: project_id , if_by_month: ifByMonth, from_date: fromDate , to_date: toDate};
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
}
