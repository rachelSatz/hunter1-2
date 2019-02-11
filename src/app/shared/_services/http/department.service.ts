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

  getDepartments(employerId: number): Promise<Department[]> {
    const request = this.getTokenHeader();
    request['params'] = { employerId: employerId };
    return this.http.get(this.endPoint, request)
      .toPromise()
      .then(response => response as Department[])
      .catch(() => []);
  }

  getDepartment(departmentId: number): Promise<Department> {
    return this.http.get(this.endPoint + '/' + departmentId, this.getTokenHeader())
      .toPromise()
      .then(response => response as Department)
      .catch(() => null);
  }


  getEmployees(departmentID: number, index: number): Promise<Employee[]> {
    const request = this.getTokenHeader();
    request['params'] = { index: index };

    return this.http.get(this.endPoint + '/' + departmentID + '/employees', request)
      .toPromise()
      .then(response => response as Employee[])
      .catch(() => []);
  }

  update(department: Department): Promise<boolean> {
    return this.http.put(this.endPoint + '/' + department.id, department, this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  create(department: Department, employerID: number): Promise<boolean> {
    return this.http.post(this.endPoint, {department: department, employerId: employerID}, this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

}
