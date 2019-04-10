import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import { User } from '../../_models/user.model';
import { Employer } from '../../_models/employer.model';
import {DataTableCriteria} from '../../data-table/classes/data-table-criteria';
import {DataTableResponse} from '../../data-table/classes/data-table-response';

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

  getUsers(criteria?: DataTableCriteria): Promise<DataTableResponse> {
    const request = this.getTokenHeader();

    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }

    return this.http.get(this.endPoint, request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);

  }

  getUser(id: number): Promise<User> {
    return this.http.get(this.endPoint + '/' + id, this.getTokenHeader())
      .toPromise()
      .then(response => response as User);
  }

  saveNewUser(user: User): Promise<any> {
    return this.http.post(this.endPoint, user, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }


  updateUser(user: User, id: number): Promise<boolean> {
    return this.http.put(this.endPoint  + '/' + id, user, this.getTokenHeader())
      .toPromise()
      .then(response => response as boolean);
  }

  usersList(): Promise<User[]> {
    return this.http.get(this.endPoint + '/usersList', this.getTokenHeader())
      .toPromise()
      .then(response => response as User[]);
  }
}
