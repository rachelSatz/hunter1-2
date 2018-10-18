import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Employee } from 'app/shared/_models/employee.model';
import { Department } from 'app/shared/_models/department.model';

@Injectable()
export class DepartmentService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/departments';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getDepartments(): Promise<Department[]> {
    return this.http.get(this.endPoint, this.getTokenHeader())
      .toPromise()
      .then(response => response as Department[])
      .catch(() => []);
  }

  getEmployees(departmentID: number): Promise<Employee[]> {
    return this.http.get(this.endPoint + '/' + departmentID + '/employees')
      .toPromise()
      .then(response => response as Employee[])
      .catch(() => []);
  }
}
