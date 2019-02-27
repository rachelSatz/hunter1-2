import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

@Injectable()
export class TaskService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/tasks';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getTasks(employerID: number): Promise<any> {
    return this.http.get(this.endPoint, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => []);
  }

  createTask(from: any): Promise<any> {
    return this.http.post(this.endPoint, from, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => []);
  }
}
