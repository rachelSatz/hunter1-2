import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { BaseHttpService } from './base-http.service';
import {UserSessionService} from '../user-session.service';


@Injectable()
export class OperatorTasksService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/operators';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  // getOperatorTasks(): Promise<any> {
  //   return this.http.get(this.endPoint + '/getOperatorTasks', this.getTokenHeader())
  //     .toPromise()
  //     .then(response => response);
  // }
  //
  // taskCompleted(): Promise<any> {
  //   return this.http.get(this.endPoint + '/taskCompleted', this.getTokenHeader())
  //     .toPromise()
  //     .then(response => response);
  // }
  //
  // rescheduledTask(): Promise<any> {
  //   return this.http.get(this.endPoint + '/rescheduledTask', this.getTokenHeader())
  //     .toPromise()
  //     .then(response => response);
  // }

  newTaskTimer(task_type?: string, typeId?: number): Promise<any> {
    return this.http.post(this.endPoint + '/createTaskTimer', { 'task_type': task_type , 'taskId': typeId}, this.getTokenHeader())
      .toPromise()
      .then(response => response as any)
      .catch(() => 0);
  }

  updateTaskTimer(id: number, duration: string, type: string, typeId?: number): Promise<any> {
    return this.http.post(this.endPoint  + '/' + id + '/updateTaskTimer', { 'duration': duration , 'typeId': typeId, 'type': type},
      this.getTokenHeader())
      .toPromise()
      .then(response => response as any)
      .catch(() => 0);
  }

  taskCompleted(typeId: string): Promise<any> {
    return this.http.post(this.endPoint  + '/taskCompleted', { 'typeId': typeId},
      this.getTokenHeader())
      .toPromise()
      .then(response => response as any)
      .catch(() => 0);
  }
}
