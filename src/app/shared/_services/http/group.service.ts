import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { Employer } from '../../_models/employer.model';
import { UserSessionService } from '../user-session.service';
import { DataTableCriteria } from '../../data-table/classes/data-table-criteria';
import { DataTableResponse } from '../../data-table/classes/data-table-response';
import FileSaver from 'file-saver';


@Injectable()
export class GroupService extends BaseHttpService {

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  readonly endPoint = this.apiUrl + '/groups';

  getGroup(id: number): Promise<any> {
    return this.http.get(this.endPoint + '/' + id, this.getTokenHeader())
      .toPromise()
      .then(response => response);
  }

  getGroups(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const request = this.getTokenHeader();

    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }

    return this.http.get(this.endPoint , request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  downloadExcelExample(): Promise<string> {
    return this.http.get(this.endPoint + '/downloadExcelExample', this.getTokenHeader())
      .toPromise()
      .then(response => response as string)
      .catch(() => null);
  }


  getAllEmployersGroup(groupId: number, criteria?: DataTableCriteria, noLimit?: boolean): Promise<any> {
    const request = this.getTokenHeader();

    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }

    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }

    return this.http.get(this.endPoint + '/getAllEmployersGroup/'  + groupId, request)
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  deleteGroup(id: number): Promise<boolean> {
    return this.http.delete(this.endPoint + '/' + id + '/deleteGroup', this.getTokenHeader())
      .toPromise()
      .then(() =>  true );
  }

  deleteEmployerGroup(ids: any[], groupId: number): Promise<boolean> {
    return this.http.post(this.endPoint + '/deleteEmployerGroup', {ids: ids, groupId: groupId}, this.getTokenHeader())
      .toPromise()
      .then(() =>  true );
  }

  updateByExcel(groupId: string, file: File): Promise<string> {
    const request = this.getTokenHeader();

    const data = new FormData();
    data.append('groupId', groupId);
    data.append('file', file);

    return this.http.post(this.endPoint + '/updateByExcel' , data, request)
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  createGroupByExcel(groupName: string, file: File): Promise<string> {
    const request = this.getTokenHeader();

    const data = new FormData();
    data.append('groupName', groupName);
    data.append('file', file);

    return this.http.post(this.endPoint + '/createGroupByExcel' , data, request)
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  createGroup(groupName: string, employers: number[], isCheckAll: boolean): Promise<any> {
    return this.http.post(this.endPoint + '/createGroup' , {'isCheckAll': isCheckAll ,
      'groupName' : groupName, 'employers': employers}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  addToGroup(groupId: number, employers: number[]): Promise<any> {
    return this.http.post(this.endPoint + '/addToGroup' , {'groupId' : groupId, 'employers': employers}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  getGroupsName() {
    return this.http.get(this.endPoint + '/getGroups', this.getTokenHeader())
      .toPromise()
      .then(response => response);
  }


}
