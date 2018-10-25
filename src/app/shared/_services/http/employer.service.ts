import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Employer } from '../../_models/employer.model';
import {Company} from '../../_models/company.model';
import { Bank } from 'app/shared/_models/bank.model';
import {BankBranch} from '../../_models/bank-branch.model';

@Injectable()
export class EmployerService extends BaseHttpService {

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }
 
  readonly endPoint = this.apiUrl + '/employers';

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
  saveNewEmployer(employer: Employer): Promise<boolean> {
    return this.http.post(this.endPoint, employer, this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  updateEmployer(employer: Employer, id: number): Promise<boolean> {
    return this.http.post(this.endPoint  + '/update/' + id, employer, this.getTokenHeader())
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

  getBankBranches(bankID: number): Promise<BankBranch[]> {
    return this.http.get(this.endPoint + '/bankBranches/' + bankID)
      .toPromise()
      .then(response => response as BankBranch[])
      .catch(() => []);
  }
}
