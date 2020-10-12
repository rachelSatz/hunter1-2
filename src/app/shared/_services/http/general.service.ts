import { Injectable } from '@angular/core';
import {BaseHttpService} from './base-http.service';
import {UserSessionService} from './user-session.service';
import {HttpClient} from '@angular/common/http';
import {DataTableCriteria} from '../../data-table/classes/data-table-criteria';
import {DataTableResponse} from '../../data-table/classes/data-table-response';
import {Project} from '../../_models/project.model';

@Injectable({
  providedIn: 'root'
})
export class GeneralService  extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/generals';
  currentEmployerID: number;
  projects: Project[] = [];
  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }
  getProjects(ProjectGroupID: number) : Promise<Project[]> {
    return this.http.get(this.endPoint+'/projects?id='+ ProjectGroupID, this.getTokenHeader())
      .toPromise()
      .then(response=> response as Project[])
      .catch(() => null);
  };

}
