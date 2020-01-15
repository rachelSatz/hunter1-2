import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Employee } from 'app/shared/_models/employee.model';
import { Department } from 'app/shared/_models/department.model';
import {DataTableResponse} from '../../data-table/classes/data-table-response';
import {DepartmentSerialNumber} from '../../_models/employer.model';

@Injectable()
export class DepartmentService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/departments';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getDepartments(employerId: number): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    request['params'] = { employerId: employerId };
    return this.http.get(this.endPoint, request)
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  getDepartment(departmentId: number): Promise<Department> {
    return this.http.get(this.endPoint + '/' + departmentId, this.getTokenHeader())
      .toPromise()
      .then(response => response as Department)
      .catch(() => null);
  }


  getEmployees(departmentID: number, val: string, index: number): Promise<Employee[]> {
    const request = this.getTokenHeader();
    if (val) {
      request['params'] = {index: index, val: val};
    } else {
      request['params'] = {index: index};
    }

    return this.http.get(this.endPoint + '/' + departmentID + '/employees', request)
      .toPromise()
      .then(response => response as Employee[])
      .catch(() => []);
  }

  update(department: Department, planId?: number): Promise<boolean> {
    return this.http.put(this.endPoint + '/' + department.id, {department: department, planId: planId} , this.getTokenHeader())
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

  addSNInCompanies(obj: any): Promise<any> {
    return this.http.post(this.endPoint + '/addSNInCompanies' ,  [obj], this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  getSNInEmployer(pk: number): Promise<DataTableResponse> {
    return this.http.get(this.endPoint + '/getSNInEmployer/' + pk , this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  getSingleSNInEmployer(pk: number, employerId: number): Promise<DepartmentSerialNumber> {
    return this.http.post(this.endPoint + '/getSingleSNInEmployer/' + pk , {employerId: employerId}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }
}
