import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
@Injectable()
export class OperatorTasksService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/operatorTasks';

  constructor(private http: HttpClient) {
    super();
  }

  getOperatorTasks(): Promise<any> {
    return this.http.get(this.endPoint + '/getOperatorTasks', this.getTokenHeader())
      .toPromise()
      .then(response => response);
  }

  taskCompleted(): Promise<any> {
    return this.http.get(this.endPoint + '/taskCompleted', this.getTokenHeader())
      .toPromise()
      .then(response => response);
  }

  rescheduledTask(): Promise<any> {
    return this.http.get(this.endPoint + '/rescheduledTask', this.getTokenHeader())
      .toPromise()
      .then(response => response);
  }
}
