import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import {Plan, PlanType} from '../../_models/plan';



@Injectable()
export class PlanService {

  // readonly endPoint = this.apiUrl + '/plan';
  //
  // constructor(private userSession: UserSessionService, private http: HttpClient) {
  //   super();
  // }

  // getPlan(id: number): Promise<Plan> {
  //   return this.http.get(this.endPoint + '/' + id, { headers: this.getTokenHeaders(this.userSession.getToken()) })
  //     .toPromise().then(response => response as Plan);
  // }
  //
  // getPlans(): Promise<Plan[]> {
  //   return this.http.get(this.endPoint, { headers: this.getTokenHeaders(this.userSession.getToken()) }).toPromise()
  //     .then(response => response as Plan[]);
  // }
  //
  // getTypes(): Promise<PlanType[]> {
  //   return this.http.get(this.endPoint + '/types', { headers: this.getTokenHeaders(this.userSession.getToken()) })
  //     .toPromise().then(response => response as PlanType[]);
  // }
  //
  // newPlan(plan: Plan): Promise<boolean> {
  //   return this.http.post(this.endPoint, plan, { headers: this.getTokenHeaders(this.userSession.getToken()) }).toPromise()
  //     .then(() => true)
  //     .catch((response) => response.status === 201);
  // }
  //
  // updatePlan(plan: Plan): Promise<boolean> {
  //   return this.http.put(this.endPoint + '/' + plan.id, plan, { headers: this.getTokenHeaders(this.userSession.getToken()) })
  //     .toPromise()
  //     .then(() => true)
  //     .catch((response) => response.status === 200);
  // }

  // activatePlan(plan: Plan): Promise<boolean> {
  //   return this.http.put(this.endPoint + '/activate/' + plan.id, { active: plan.isActive },
  //     { headers: this.getTokenHeaders(this.userSession.getToken()) }).toPromise()
  //     .then(() => true)
  //     .catch((response) => response.status === 200);
  // }
  //
  // remove(plan: Plan): Promise<boolean> {
  //   return this.http.delete(this.endPoint + '/' + plan.id,
  //     { headers: this.getTokenHeaders(this.userSession.getToken()) }).toPromise()
  //     .then(() => true)
  //     .catch((response) => response.status === 200);
  // }
}
