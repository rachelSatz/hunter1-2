import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import { TaskModel } from '../../_models/task.model';

@Injectable()
export class TaskService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/tasks';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getTasks(employerID: number): Promise<TaskModel[]> {
    const header = this.getTokenHeader();
    if (employerID !== 0) {
      header['params'] = {employerID: employerID};
    }
    return this.http.get(this.endPoint, header)
      .toPromise()
      .then(response => response as TaskModel[])
      .catch(() => []);
  }

  createTask(from: any): Promise<any> {
    return this.http.post(this.endPoint, from, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }
}
