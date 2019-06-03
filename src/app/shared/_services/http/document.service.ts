import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import { DataTableResponse } from '../../data-table/classes/data-table-response';
import { DataTableCriteria } from '../../data-table/classes/data-table-criteria';


@Injectable()
export class  DocumentService extends BaseHttpService {

  file: File;

  readonly endPoint = this.apiUrl + '/documents';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getDocuments(criteria?: DataTableCriteria): Promise<DataTableResponse> {
    const request = this.getTokenHeader();

    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }

    return this.http.get(this.endPoint, request)
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  downloadFile(rowID: number, employerId: number): Promise<string> {
    const options = this.getTokenHeader();

    if (employerId) {
      options['params'] = {employerId: employerId};
    }
    return this.http.get(this.endPoint + '/' + rowID,
      options)
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  deleteFile(rowID: number, employerId: number): Promise<any> {
    const options = this.getTokenHeader();

    if (employerId) {
      options['params'] = {employerId: employerId};
    }
    return this.http.delete(this.endPoint + '/' + rowID, options)
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  uploadFile(employerId, description: string, file: File, documentType) {
    this.file = file;
    const data = new FormData();
    data.append('file', file);
    data.append('description', description);
    data.append('employerId', employerId);
    data.append('documentType', documentType);
    return this.http.post(this.endPoint , data, this.getTokenHeader()).toPromise().then(response => response)
      .catch(() => null);
  }
}
