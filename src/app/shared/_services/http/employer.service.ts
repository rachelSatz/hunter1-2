import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Employer } from '../../_models/employer.model';

import {Department} from '../../_models/department.model';

import {EmployerFinancialDetails} from '../../_models/employer-financial-details.model';
import {DataTableCriteria} from '../../data-table/classes/data-table-criteria';
import {DataTableResponse} from '../../data-table/classes/data-table-response';


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
     .catch(response => null);
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
      .catch(response => null);
  }

  // getAllPayEmployers(): Promise<Any> {
  //   const request = this.getTokenHeader();
  //
  //   return this.http.get(this.endPoint + '/pay_employers', request)
  //     .toPromise()
  //     .then(response => response as Any)
  //     .catch(response => null);
  // }

  newEmployer(employer: any, department: any): Promise<any> {
    return this.http.post(this.endPoint, {employer: employer , department: department}, this.getTokenHeader())
    .toPromise()
    .then(response => response as any);
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
  
  saveFinancialDetails(employerId: number, financialDetails: EmployerFinancialDetails): Promise<boolean> {
    return this.http.post(this.endPoint + '/saveFinanceDetails',
      {financialDetails: financialDetails, employerId: employerId}, this.getTokenHeader())
      .toPromise()
      .then(response =>  response as boolean);
  }

  getOperator(id: number, type?: string): Promise<any> {
    return this.http.get(this.endPoint + '/operators?'  + type + '=' + id, this.getTokenHeader())
      .toPromise()
      .then(response => response as any);
  }

  getAllOperators(): Promise<any> {
    return this.http.get(this.endPoint + '/all_operators', this.getTokenHeader())
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

  monthlyReports(employerId: number): Promise<any> {
    return this.http.get(this.endPoint + '/' + employerId +  '/monthlyReports' , this.getTokenHeader())
      .toPromise()
      .then( response => response );
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
}
