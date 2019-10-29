import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import { DataTableResponse } from '../../data-table/classes/data-table-response';
import { DataTableCriteria } from '../../data-table/classes/data-table-criteria';
import { Employer } from 'app/shared/_models/employer.model';
import { el } from '@angular/platform-browser/testing/src/browser_util';



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

  updateDocument(document, id: number): Promise<any> {
    return this.http.post(this.endPoint  + '/update/' + id, document, this.getTokenHeader())
      .toPromise()
      .then(response => response);
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

  uploadFiles(files: File[] , employer_id: number ) {
    const data = new FormData();
    const documentTypes = [];
    const ids = [];
    for (let i = 0; i <= files.length - 1 ; i++) {
      if (files[i] !== undefined) {
        data.append('file', files[i]);
        if (files[i] instanceof File ) {
          ids.push(files[i]['id'] === undefined ? 0 : files[i]['id'] );
          documentTypes.push(i === 0 ? 'contract' : i === 1 ?  'employer_poa' :  i === 2 ? 'authorization_protocol' :  'customer_details');
        }
      }
    }

    data.append('documentsType', JSON.stringify(documentTypes));
    data.append('ids', JSON.stringify(ids));

    return this.http.post(this.endPoint   + '/' +  employer_id + '/update'  , data, this.getTokenHeader())
      .toPromise()
      .then(response => response);
    // this.http.post(this.endPoint , files, this.getTokenHeader()).toPromise().then(response => response)
    //      .catch(() => null);
  }

  getIsNegativeFile(employer_id: number): Promise<boolean> {
    const path_url = this.endPoint + '/' + employer_id +  '/isNegativeFile';
    return this.http.get(path_url, this.getTokenHeader())
      .toPromise()
      .then(response => response as boolean);
  }

}
