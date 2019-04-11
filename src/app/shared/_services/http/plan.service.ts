import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import {Plan, PlanType} from '../../_models/plan';
import {UserSessionService} from '../user-session.service';
import {DataTableResponse} from '../../data-table/classes/data-table-response';



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

  getPlans(): Promise<DataTableResponse> {
    return this.http.get(this.endPoint,  this.getTokenHeader())
      .toPromise()
      .then(response => response as DataTableResponse);
  }

  getSinglePlan(): Promise<any> {
    return this.http.get(this.endPoint + '/getSinglePlan',  this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => []);
  }


  getTypes(): Promise<PlanType[]> {
    return this.http.get(this.endPoint + '/types',  this.getTokenHeader())
      .toPromise().then(response => response as PlanType[]);
  }

  create(plan: Plan, categories: string[]): Promise<any> {
    return this.http.post(this.endPoint, {data: plan, categories: categories},  this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => []);
  }

  update(plan: Plan, categories: string[]): Promise<any> {
    return this.http.put(this.endPoint + '/' + plan.id, {data: plan, categories: categories}, this.getTokenHeader())
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
