import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Employer} from '../../_models/employer.model';
import {BaseHttpService} from './base-http.service';
import {UserSessionService} from './user-session.service';
import {EmployerFinancialDetails} from '../../_models/employer-financial-details.model';
import {DataTableCriteria} from '../../data-table/classes/data-table-criteria';
import {DataTableResponse} from '../../data-table/classes/data-table-response';

@Injectable({
  providedIn: 'root'
})
export class EmployerService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/employers';
  currentEmployerID: number;
  constructor(userSession:UserSessionService, private http: HttpClient) {
    super(userSession);
}

  // endPoint ='http://192.168.1.99:8000/api/employers/';
  getEmployers() : Promise<any> {
    return this.http.get(this.endPoint+'/employer_list',this.getTokenHeader())
      .toPromise()
      .then(response=> response as any)
      .catch(() => null);
  };

  getAllEmployers(criteria?: DataTableCriteria, noLimit?: boolean) : Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }

    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }
    return this.http.get(this.endPoint, request)
      .toPromise()
      .then(response=> response as DataTableResponse)
      .catch(() => null);
  };
  getEmployerFinance(id: number) : Promise<any> {
    return this.http.get(this.endPoint+'/employerFinance?employer_id='+id, this.getTokenHeader())
      .toPromise()
      .then(response=> response as any)
      .catch(() => null);
  };
  saveFinancialDetails(employerId: number, financialDetails: EmployerFinancialDetails): Promise<boolean> {
    return this.http.post(this.endPoint + '/saveFinanceDetails',
      {financialDetails: financialDetails, employerId: employerId}, this.getTokenHeader())
      .toPromise()
      .then(response =>  response as boolean);
  }
  getEmployer(employerId: number): Promise<Employer>{
    debugger;
    return this.http.get(this.endPoint+'/getEmployer?id='+employerId, this.getTokenHeader())
      .toPromise()
      .then(response => response as Employer)
      .catch(() => null);
  }
  getEmployerByEmployerRelationId(employerRelationId): Promise<Employer>{
    return this.http.get(this.endPoint+'/getEmployerByEmployerRelationId?id='+employerRelationId, this.getTokenHeader())
      .toPromise()
      .then(response => response as Employer)
      .catch(() => null);
  }


  getEmployersWithEstPayment(criteria?: DataTableCriteria, noLimit?: boolean) : Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }

    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }
    return this.http.get(this.endPoint +'/getEmployersWithEstPayment', request)
      .toPromise()
      .then(response=> response as DataTableResponse)
      .catch(() => null);
  };

}
