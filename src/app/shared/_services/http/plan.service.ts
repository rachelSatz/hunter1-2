import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import {Plan, PlanType} from '../../_models/plan';



@Injectable()
export class PlanService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/plan';

  constructor(private http: HttpClient) {
    super();
  }

  getPlan(id: number): Promise<Plan> {
    return this.http.get(this.endPoint + '/' + id,  this.getTokenHeader())
      .toPromise().then(response => response as Plan);
  }

  getPlans(): Promise<Plan[]> {
    return this.http.get(this.endPoint,  this.getTokenHeader()).toPromise()
      .then(response => response as Plan[]);
  }

  getTypes(): Promise<PlanType[]> {
    return this.http.get(this.endPoint + '/types',  this.getTokenHeader())
      .toPromise().then(response => response as PlanType[]);
  }

  newPlan(plan: Plan, categories: any): Promise<boolean> {
    return this.http.post(this.endPoint, {plan: plan, categories: categories},  this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch((response) => response.status === 201);
  }

  updatePlan(plan: Plan, categories: any): Promise<boolean> {
    return this.http.post(this.endPoint + '/' + plan.id, {plan: plan, categories: categories}, this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch((response) => response.status === 200);
  }

  // activatePlan(plan: Plan): Promise<boolean> {
  //   return this.http.put(this.endPoint + '/activate/' + plan.id, { active: plan.isActive },
  //     { headers: this.getTokenHeader() }).toPromise()
  //     .then(() => true)
  //     .catch((response) => response.status === 200);
  // }

  // remove(plan: Plan): Promise<boolean> {
  //   return this.http.delete(this.endPoint + '/' + plan.id,
  //     { headers: this.getTokenHeader() }).toPromise()
  //     .then(() => true)
  //     .catch((response) => response.status === 200);
  // }
}
