import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import { Document } from 'app/shared/_models/document.model';
import {Process} from '../../_models/process.model';


@Injectable()
export class  DocumentService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/documents';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getDocuments(employerId: number): Promise<Document[]> {
    const options = this.getTokenHeader();

    if (employerId) {
      options['params'] = {employerId: employerId};
    }

    return this.http.get(this.endPoint, options)
      .toPromise()
      .then(response => response as Document[])
      .catch(() => []);
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

  uploadFile(employerId, description: string, file: File) {
    const data = new FormData();
    data.append('file', file);
    data.append('description', description);
    data.append('employerId', employerId);
    return this.http.post(this.endPoint , data, this.getTokenHeader()).toPromise().then(response => response)
      .catch(() => null);
  }
}
