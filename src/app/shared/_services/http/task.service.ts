import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import {DataTableResponse} from '../../data-table/classes/data-table-response';
import {TaskModel} from '../../_models/task.model';
import {Department} from '../../_models/department.model';

@Injectable()
export class TaskService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/tasks';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getTasks(employerID: number): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (employerID !== 0) {
      request['params'] = {employerID: employerID};
    }
    return this.http.get(this.endPoint, request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getTask(taskId: number): Promise<TaskModel> {
    return this.http.get(this.endPoint + '/' + taskId, this.getTokenHeader())
      .toPromise()
      .then(response => response as TaskModel)
      .catch(() => null);
  }

  createTask(from: any): Promise<any> {
    return this.http.post(this.endPoint, from, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }
}
