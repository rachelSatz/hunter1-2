import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from './user-session.service';
import { EmployerFinancialDetails } from '../../_models/employer-financial-details.model';
import { DataTableCriteria } from '../../data-table/classes/data-table-criteria';
import { DataTableResponse } from '../../data-table/classes/data-table-response';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { SelectUnitService } from '../select-unit.service';

@Injectable({
  providedIn: 'root'
})
export class EmployerService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/employers';
  constructor(userSession: UserSessionService, private http: HttpClient, private selectunit: SelectUnitService) {
    super(userSession);
}

  getProjectGroupId(): void {
    return this.selectunit.getProjectGroupId();
  }

  getEmployersByOrganizationId(organizationId: number): Promise<any> {
    const request = this.getTokenHeader();
    request['params'] = {};
    request['params']['organization_id'] = organizationId;
    request['params']['project_group_id'] = this.getProjectGroupId();
    return this.http.get(this.endPoint + '/employer_list', request)
      .toPromise()
      .then(response => response as any)
      .catch(() => null);
  }

  getPayEmployers(): Promise<any> {
    const request = this.getTokenHeader();
    request['params'] = {};
    request['params']['project_group_id'] = this.getProjectGroupId();
    return this.http.get(this.endPoint + '/pay_employer_list',  request)
      .toPromise()
      .then(response => response as any)
      .catch(() => null);
  }

  // getEmployers(): Observable<any> {
  //   const request = this.getTokenHeader();
  //   request['params'] = {};
  //   request['params']['project_group_id'] = this.getProjectGroupId();
  //   return this.http.get(this.endPoint + '/employer_list', request)
  //     .map(response => response as any);
  // }

  getEmployers(): Promise<any> {
    const request = this.getTokenHeader();
    request['params'] = {};
    request['params']['project_group_id'] = this.getProjectGroupId();
    return this.http.get(this.endPoint + '/employer_list', request)
      .toPromise()
      .then(response => response as any)
      .catch(() => null);
  }

  getEmployersByProjectId(projectId: number): Promise<any> {
    const request = this.getTokenHeader();
    request['params'] = {};
    request['params']['project_id'] = projectId;
    request['params']['project_group_id'] = this.getProjectGroupId();
    return this.http.get(this.endPoint + '/employer_list', request)
      .toPromise()
      .then(response => response as any)
      .catch(() => null);
  }

  getEmployerExternalByEmployerId(employer_id: number): Promise<number> {
    return this.http.get(this.endPoint + '/getEmployerExternalByEmployerId?employer_id=' + employer_id, this.getTokenHeader())
      .toPromise()
      .then(response => response as any)
      .catch(() => null);
  }

  getAllEmployers(criteria?: DataTableCriteria, is_active?: boolean, project_group?: any): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
      request['params']['is_active'] = is_active;
      request['params']['project_group'] = project_group;
    }
    return this.http.get(this.endPoint, request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getEmployerFinance(id: number): Promise<any> {
    const request = this.getTokenHeader();
    request['params'] = {};
    request['params']['employer_relation'] = id;
    return this.http.get(this.endPoint + '/employerFinance', request)
      .toPromise()
      .then(response => response as any)
      .catch(() => null);
  }

  saveFinancialDetails(employerRelation: number, financialDetails: EmployerFinancialDetails): Promise<boolean> {
    return this.http.post(this.endPoint + '/saveFinanceDetails',
      {financialDetails: financialDetails, employer_relation: employerRelation, project_group_id: this.getProjectGroupId()},
      this.getTokenHeader())
      .toPromise()
      .then(response =>  response as boolean);
  }

  getEmployer(employer_relation: number): Promise<any> {
    const request = this.getTokenHeader();
    request['params'] = {}
    request['params']['employer_relation'] = employer_relation;
    return this.http.get(this.endPoint + '/getEmployer' , request)
      .toPromise()
      .then(response => response as any)
      .catch(() => null);
  }

  getEmployersWithEstPayment(criteria?: DataTableCriteria, noLimit?: boolean): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
      request['params']['project_group_id'] = this.getProjectGroupId();
    }
    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }
    return this.http.get(this.endPoint + '/getEmployersWithEstPayment', request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getEmployersByPayment(criteria?: DataTableCriteria, noLimit?: boolean): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
      request['params']['project_group_id'] = this.getProjectGroupId();
    }
    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }
    return this.http.get(this.endPoint + '/getEmployersByPayment', request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getEmployersPayedByOther(criteria?: DataTableCriteria, noLimit?: boolean): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
      request['params']['project_group_id'] = this.getProjectGroupId();
    }
    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }
    return this.http.get(this.endPoint + '/getEmployersPayedByOther', request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getEmployersDashboard(data: object): Promise<any> {
    return this.http.post(this.endPoint + '/employersDashboard',
      {data: data}, this.getTokenHeader())
      .toPromise()
      .then(response => response);
  }

}
