import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import { User } from '../../_models/user.model';
import { Employer } from '../../_models/employer.model';

@Injectable()
export class UserService extends BaseHttpService {
  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  readonly endPoint = this.apiUrl + '/users';

  getEmployers(): Promise<Employer[]> {
    return this.http.get(this.apiUrl  + '/employers', this.getTokenHeader())
    .toPromise()
    .then(response => response as Employer[]);
  }

  getUsers(searchCriteria?: Object): Promise<User[]> {
    const request = this.getTokenHeader();

    if (searchCriteria) {
      request['params'] = searchCriteria;
    }

    return this.http.get(this.endPoint, request)
      .toPromise()
      .then(response => response as User[]);
  }

  getUser(id: number): Promise<User> {
    return this.http.get(this.endPoint + '/' + id, this.getTokenHeader())
      .toPromise()
      .then(response => response as User);
  }

}
