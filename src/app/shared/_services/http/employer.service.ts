import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Employer } from '../../_models/employer.model';
import {Company} from '../../_models/company.model';
import { Bank } from 'app/shared/_models/bank.model';

@Injectable()
export class EmployerService extends BaseHttpService {

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }
 
  readonly endPoint = this.apiUrl + '/employer';

  getEmployer(id: number): Promise<Employer> {
    return this.http.get(this.endPoint + '/' + id, this.getTokenHeader())
    .toPromise()
    .then(response => response as Employer);
  }

  getEmployers(): Promise<Employer[]> {
    return this.http.get(this.endPoint, this.getTokenHeader())
    .toPromise()
    .then(response => response as Employer[]);
  }

   
  newEmployer(employer: Employer): Promise<Employer> {
    return this.http.post(this.endPoint, employer, this.getTokenHeader())
    .toPromise()
    .then(response => response as Employer);
  }

  updateEmployer(employer: Employer, id: number): Promise<boolean> {
    return this.http.put(this.endPoint  + '/' + id, employer, this.getTokenHeader())
    .toPromise()
    .then(response => response as boolean);
  }

  deleteEmployer(id: number): Promise<{ responseCode: number }> {
    return this.http.delete(this.endPoint, this.getTokenHeader())
    .toPromise()
    .then(response => response as { responseCode: number });
  }

  getBanks(): Promise<Bank[]> {
    return this.http.get(this.endPoint + '/banks')
      .toPromise()
      .then(response => response as Bank[])
      .catch(() => []);
  }

  getBankBranches(bankID: number): Promise<string[]> {
    return this.http.get(this.endPoint + '/bankBranches/' + bankID)
      .toPromise()
      .then(response => response as string[])
      .catch(() => []);
  }
}
