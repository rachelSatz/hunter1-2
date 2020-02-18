import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { Plan, PlanType} from '../../_models/plan';
import { UserSessionService} from '../user-session.service';
import { PlanTask} from '../../_models/plan-task';
import { DataTableResponse} from '../../data-table/classes/data-table-response';
import {Observable} from 'rxjs';
import {Company} from '../../_models/company.model';
import {DataTableCriteria} from '../../data-table/classes/data-table-criteria';

@Injectable()
export class PlanService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/plans';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getPlan(id: number): Promise<Plan> {
    return this.http.get(this.endPoint + '/' + id,  this.getTokenHeader())
      .toPromise().then(response => response as Plan);
  }

  getPlans(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const request = this.getTokenHeader();

    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }
    return this.http.get(this.endPoint,  request)
      .toPromise()
      .then(response => response as DataTableResponse);
  }

  getSinglePlan(): Promise<PlanTask> {
    return this.http.post(this.endPoint + '/getCurrentTask', {},  this.getTokenHeader())
      .toPromise()
      .then(response => response as PlanTask)
      .catch(() => null);
  }


  getTypes(): Promise<any> {
    return this.http.get(this.endPoint + '/categoriesOptions',  this.getTokenHeader())
      .toPromise().then(response => response as any);
  }

  // getFullCompanies(): Observable<Company[]> {
  //   return this.http.get(this.endPoint + '/fullCompany', this.getTokenHeader())
  //     .map((response: Response) => response as any);
  // }

  create(plan: Plan): Promise<any> {
    return this.http.post(this.endPoint, {data: plan},  this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => []);
  }

  update(plan: Plan): Promise<any> {
    return this.http.put(this.endPoint + '/' + plan.id, {data: plan}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => []);
  }

  activatePlan(plan: Plan): Promise<any> {
    return this.http.post(this.endPoint + '/' + plan.id + '/activate', { active: plan.is_active },
      this.getTokenHeader()).toPromise()
      .then(response => response)
      .catch(() => []);
  }

  // remove(plan: Plan): Promise<boolean> {
  //   return this.http.delete(this.endPoint + '/' + plan.id,
  //     { headers: this.getTokenHeader() }).toPromise()
  //     .then(() => true)
  //     .catch((response) => response.status === 200);
  // }
}
