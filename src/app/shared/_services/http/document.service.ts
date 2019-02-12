import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

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
}
