import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Employer } from '../../_models/employer.model';
import {Company} from '../../_models/company.model';
import { Bank } from 'app/shared/_models/bank.model';
import {BankBranch} from '../../_models/bank-branch.model';
import {Employee} from '../../_models/employee.model';
import {Department} from '../../_models/department.model';
import {Subject} from 'rxjs';
import {EmployerFinancialDetails} from '../../_models/employer-financial-details.model';

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

  getEmployers(organizationId: number): Promise<Employer[]> {
    const request = this.getTokenHeader();

    request['params'] = {organizationId: organizationId};

    return this.http.get(this.endPoint , request)
    .toPromise()
    .then(response => response as Employer[]);
  }

  getAllEmployers(searchCriteria: any): Promise<Employer[]> {
    const request = this.getTokenHeader();

    if (searchCriteria) {
      request['params'] = searchCriteria;
    }

    return this.http.get(this.endPoint + '/allEmployers', request)
      .toPromise()
      .then(response => response as Employer[]);
  }
   
  newEmployer(employer: Employer): Promise<Employer> {
    return this.http.post(this.endPoint, employer, this.getTokenHeader())
    .toPromise()
    .then(response => response as Employer);
  }
  saveNewEmployer(employer: Employer, organizationID: number): Promise<any> {
    employer.organizationId = organizationID;
    return this.http.post(this.endPoint, employer, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  updateEmployer(employer: Employer, id: number): Promise<any> {
    return this.http.post(this.endPoint  + '/update/' + id, employer, this.getTokenHeader())
    .toPromise()
    .then(response => response);
  }

  deleteEmployer(id: number): Promise<{ responseCode: number }> {
    return this.http.delete(this.endPoint, this.getTokenHeader())
    .toPromise()
    .then(response => response as { responseCode: number });
  }

  getDepartments(employerID: number): Promise<Department[]> {
    return this.http.get(this.endPoint + '/' + employerID + '/departments', this.getTokenHeader())
      .toPromise()
      .then(response => response as Department[])
      .catch(() => []);
  }

  getDepartmentsAndEmployees(employerID: number, organizationId: number): Promise<Object> {
    const request = this.getTokenHeader();
    request['params'] = {organizationId: organizationId};

    return this.http.get(this.endPoint + '/' + (employerID ? employerID : 0) + '/departmentsAndEmployees', request)
      .toPromise()
      .then(response => response as Object)
      .catch(() => []);
  }


  uploadExcelEmployers(uploadedFile?: File, organizationId?: number): Promise<Object> {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('organizationId',  JSON.stringify(organizationId));

      return this.http.post(this.endPoint + '/uploadExcelEmployers', formData, this.getTokenHeader())
        .toPromise()
        .then(response => response as Object)
        .catch(() => []);
    }
  }

  getEmployerFinance(employerId: number): Promise<EmployerFinancialDetails> {
    const request = this.getTokenHeader();
    request['params'] = {employer_id: employerId};

    return this.http.get(this.endPoint + '/employerFinance', request)
      .toPromise()
      .then(response => response as EmployerFinancialDetails)
      .catch(() => null);
  }


  updateFinancialDetails(id: number, financialDetails: EmployerFinancialDetails): Promise<boolean> {
    return this.http.post(this.endPoint + '/' + id + '/saveFinanceDetails', {financialDetails: financialDetails}, this.getTokenHeader())
      .toPromise()
      .then(response =>  response as boolean);
  }

  saveFinancialDetails(financialDetails: EmployerFinancialDetails): Promise<boolean> {
    return this.http.post(this.endPoint + '/saveFinanceDetails', {financialDetails: financialDetails}, this.getTokenHeader())
      .toPromise()
      .then(response =>  response as boolean);
  }
}
