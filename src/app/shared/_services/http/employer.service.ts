import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { Employer } from '../../_models/employer.model';
import { UserSessionService } from '../user-session.service';
import { DataTableCriteria } from '../../data-table/classes/data-table-criteria';
import { DataTableResponse } from '../../data-table/classes/data-table-response';
import { EmployerFinancialDetails } from '../../_models/employer-financial-details.model';
import {Contact} from '../../_models/contact.model';


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

  getEmployers(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const request = this.getTokenHeader();

    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }

    return this.http.get(this.endPoint , request)
    .toPromise()
    .then(response => response as DataTableResponse)
     .catch(() => null);
  }

  getEmployerByOrganization(id: number): Promise<Employer[]> {
    return this.http.get(this.endPoint + '/' + id + '/employerByOrganization' , this.getTokenHeader())
      .toPromise()
      .then(response => response as Employer)
      .catch(() => null);
  }

  getAllEmployers(criteria?: DataTableCriteria, noLimit?: boolean): Promise<DataTableResponse> {
    const request = this.getTokenHeader();

    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }

    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }

    return this.http.get(this.endPoint + '/allEmployers', request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getAllPayEmployers(): Promise<Employer> {
    const request = this.getTokenHeader();
    return this.http.get(this.endPoint + '/allPayEmployers', request)
      .toPromise()
      .then(response => response as Employer)
      .catch(() => null);
  }


  newEmployer(employer: any, department: any, employerDetails: any): Promise<any> {
    return this.http.post(this.endPoint, {employer: employer , department: department, employerDetails: employerDetails}
    , this.getTokenHeader())
    .toPromise()
    .then(response => response as any);
  }

  getIsEmployerFile(employer_id: number): Promise<any> {
    const path_url = this.endPoint + '/' + employer_id +  '/checkFileEmployer';
    return this.http.get(path_url, this.getTokenHeader())
      .toPromise()
      .then(response => response);
  }

  updateEmployer(employer: Employer, id: number, employer_details?: any): Promise<any> {
    return this.http.post(this.endPoint  + '/update/' + id, {employer: employer, employer_details: employer_details}, this.getTokenHeader())
    .toPromise()
    .then(response => response);
  }

  getEmployerFinance(employerId: number): Promise<EmployerFinancialDetails> {
    const request = this.getTokenHeader();
    request['params'] = {employer_id: employerId};

    return this.http.get(this.endPoint + '/employerFinance', request)
      .toPromise()
      .then(response => response as EmployerFinancialDetails)
      .catch(() => null);
  }

  saveFinancialDetails(employerId: number, financialDetails: EmployerFinancialDetails): Promise<boolean> {
    return this.http.post(this.endPoint + '/saveFinanceDetails',
      {financialDetails: financialDetails, employerId: employerId}, this.getTokenHeader())
      .toPromise()
      .then(response =>  response as boolean);
  }

  getOperator(isIncludesAdmin: boolean = true, projectId?: number): Promise<any> {
    const request = this.getTokenHeader();
    request['params'] = {is_includes_admin: isIncludesAdmin, projectId: projectId};
    return this.http.get(this.endPoint + '/operators', request)
      .toPromise()
      .then(response => response as any);
  }


  getProjects(): Promise<any> {
    return this.http.get(this.endPoint + '/projects', this.getTokenHeader()).toPromise()
      .then( response => response );
  }

  updateMonthlyReports(report: any, employerId: number): Promise<any> {
    return this.http.put(this.endPoint + '/' + employerId +  '/monthlyReports', report , this.getTokenHeader())
      .toPromise()
      .then( response => response );
  }

  getEmployerDetailsOnProcess(id: number): Promise<any> {
    return this.http.get(this.endPoint + '/' + id +  '/editEmployerOnProcess', this.getTokenHeader())
      .toPromise()
      .then(response => response as any);
  }

  getEmployerBankAccounts(criteria: DataTableCriteria, employerId: number ): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }
    return this.http.get(this.endPoint + '/' + employerId +  '/employerBankAccounts' , request)
      .toPromise()
      .then( response => response )
      .catch(response => response);
  }

  getEmployerBankAccount(employerId: number): Promise<any> {
    return this.http.get(this.endPoint + '/' + employerId +  '/employerBankAccount' , this.getTokenHeader())
      .toPromise()
      .then( response => response );
  }

  setDefaultEmployerBA(employerId: number, employerBank: any): Promise<any> {
    return this.http.put(this.endPoint + '/setDefaultEmployerBA' , {
      employerId: employerId, bankAccountId: employerBank.bank_account_id ,
      employerBankId: employerBank.id, product_id: employerBank.product_id },
      this.getTokenHeader())
      .toPromise()
      .then( response => response );
  }

  getEmployersDashboard(data: object): Promise<any> {
    return this.http.post(this.endPoint + '/employersDashboard',
      {data: data}, this.getTokenHeader())
      .toPromise()
      .then(response => response);
  }

  getEmployeesCountDetails(criteria?: DataTableCriteria, noLimit?: boolean) {
    const request = this.getTokenHeader();

    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }

    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }

    return this.http.get(this.apiUrl + '/reports/' + 'getEmployeesCountDetails', request)
      .toPromise()
      .then(response => response as any);

  }

  getCity(): Promise<any> {
    return this.http.get(this.endPoint + '/getCity', this.getTokenHeader())
      .toPromise()
      .then(response => response);
  }

  getNewEmployer(): Promise<number> {
    return this.http.get(this.endPoint + '/getNewEmployers' , this.getTokenHeader())
      .toPromise()
      .then(response => response as number);
  }

}
