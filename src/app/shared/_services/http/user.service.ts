import { Injectable } from '@angular/core';
import {BaseHttpService} from './base-http.service';
import {UserSessionService} from './user-session.service';
import {HttpClient} from '@angular/common/http';
import {User} from '../../_models/user.model';
import {DataTableCriteria} from '../../data-table/classes/data-table-criteria';
import {DataTableResponse} from '../../data-table/classes/data-table-response';

@Injectable()
export class UserService extends BaseHttpService{

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  readonly endPoint = this.apiUrl+'/users';

  getUser(id: number): Promise<User> {
    return this.http.get(this.endPoint + '/' + id, this.getTokenHeader())
      .toPromise()
      .then(response => response as User);
  }
  updateUser(user: User, id: number): Promise<boolean> {
    return this.http.put(this.endPoint  + '/' + id, user, this.getTokenHeader())
      .toPromise()
      .then(response => response as boolean);
  }
  saveNewUser(user: User): Promise<any> {
    return this.http.post(this.endPoint, user, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }
  getUsers(criteria?: DataTableCriteria, is_active?: boolean): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
      request['params']['is_active'] = is_active;
    }
    return this.http.get(this.endPoint, request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);

  }
}
