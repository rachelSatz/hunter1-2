import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Bank } from '../../_models/bank.model';
import { BankBranch } from '../../_models/bank-branch.model';
import { Manufacturer } from '../../_models/manufacturer.model';
import { Product } from '../../_models/product.model';
import * as FileSaver from 'file-saver';
import {promise} from 'selenium-webdriver';
// import { Application } from "../../_models/Application.model";
// import { Agent } from "../../_models/agent.model";

@Injectable()
export class GeneralHttpService extends BaseHttpService {
  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  // getBanks(): Promise<Bank[]> {
  //   return this.http.get(this.apiUrl  + '/bank', this.getTokenHeader())
  //   .toPromise()
  //   .then(response => response as Bank[]);
  // }

  getEmployerBankBranch(Employerid: number, Processid: number): Promise<BankBranch> {
    return this.http.get(this.apiUrl  + '/Employerbank/' + Employerid + '/Process/' + Processid, this.getTokenHeader())
    .toPromise()
    .then(response => response as BankBranch);
  }
  // getBankBranches(bankID: number): Promise<BankBranch[]> {
  //   return this.http.get(this.apiUrl  + '/bank/' + +bankID + '/branch', this.getTokenHeader())
  //   .toPromise()
  //   .then(response => response as BankBranch[]);
  // }
 // newAgent(agent:Agent): Promise<Agent> {
 //    return this.http.post(this.apiUrl + '/agent/' , agent, this.getTokenHeader())
 //    .toPromise()
 //    .then(response => response as Agent);
 //  }
 //
 //  updateAgent(agent:Agent, id: number): Promise<boolean> {
 //    return this.http.put(this.apiUrl + '/agent/' + id, agent, this.getTokenHeader())
 //    .toPromise()
 //    .then(response => response as boolean);
 //  }
 //   getAgent(AgentID: number): Promise<Agent> {
 //    return this.http.get(this.apiUrl  + '/agent/' + AgentID, this.getTokenHeader())
 //    .toPromise()
 //    .then(response => response as Agent);
 //  }
 //  getAgents(): Promise<Agent[]> {
 //    return this.http.get(this.apiUrl  + '/agent', this.getTokenHeader())
 //    .toPromise()
 //    .then(response => response as Agent[]);
 //  }

  getManufacturers(): Promise<Manufacturer[]> {
    return this.http.get(this.apiUrl  + '/manufacturer', this.getTokenHeader())
    .toPromise()
    .then(response => response as Manufacturer[]);
  }

// getApplication(Applicationid: number , employee?: Boolean): Promise<Application> {
//     return this.http.get(this.apiUrl  + '/Application/' + Applicationid + "/" + employee, this.getTokenHeader())
//     .toPromise()
//     .then(response => response as Application);
//   }

  getProducts(): Promise<Product[]> {
    return this.http.get(this.apiUrl  + '/product', this.getTokenHeader())
    .toPromise()
    .then(response => response as Product[]);
  }

  getProductsByManuf(manufacturerId: number): Promise<Product[]> {
    return this.http.get(this.apiUrl + '/manufacturer/' + manufacturerId + '/product', this.getTokenHeader())
    .toPromise()
    .then(response => response as Product[]);
  }

  getSugTakbulEnum(): Promise<{Key: string, Value: number}[]> {
    return this.http.get(this.apiUrl  + '/sugTakbul', this.getTokenHeader())
    .toPromise()
    .then(response => response as {Key: string, Value: number}[]);
  }

  getStatusDepositEnum(): Promise<{Key: string, Value: number}[]> {
    return this.http.get(this.apiUrl  + '/statusdeposit', this.getTokenHeader())
    .toPromise()
    .then(response => response as {Key: string, Value: number}[]);
  }

  getEmployerTypeSentEnum(): Promise<{Key: string, Value: number}[]> {
    return this.http.get(this.apiUrl  + '/employerTypeSent', this.getTokenHeader())
    .toPromise()
    .then(response => response as {Key: string, Value: number}[]);
  }

  getWorksInSalaryEnum(): Promise<{Key: string, Value: number}[]> {
    return this.http.get(this.apiUrl  + '/statusWorksInSalary', this.getTokenHeader())
    .toPromise()
    .then(response => response as {Key: string, Value: number}[]);
  }

  getFilesByEmployer(employerId: Number): Promise<any> {
    return this.http.get(this.apiUrl + '/employer/' + employerId + '/folders', this.getTokenHeader())
    .toPromise()
    .then(response => response);
  }

  getFilesByEmployee(employeeId: Number): Promise<any> {
    return this.http.get(this.apiUrl + '/employee/' + employeeId + '/folders', this.getTokenHeader())
    .toPromise()
    .then(response => response);
  }

  getDashboardCounts(searchCriteria: Object): Promise<any> {
    const options = this.getTokenHeader();
    options['params'] = searchCriteria;

    return this.http.get(this.apiUrl + '/stats/common', options)
    .toPromise()
    .then(response => response);
  }

  getBarChartData(searchCriteria: Object): Promise<any> {
    const options = this.getTokenHeader();
    options['params'] = searchCriteria;

    return this.http.get(this.apiUrl + '/stats/feedbackCounts', options)
    .toPromise()
    .then(response => response);
  }

  getBanks(withBranches?: boolean): Promise<Bank[]> {
    const request = this.getTokenHeader();
    if (withBranches) {
      request['params'] = { withBranches: 1 };
    }

    return this.http.get(this.apiUrl + '/generals' + '/banks', request )
      .toPromise()
      .then(response => response as Bank[])
      .catch(() => []);
  }

  getBankBranches(bankID: number): Promise<BankBranch[]> {
    return this.http.get(this.apiUrl + '/generals' + '/bankBranches/' + bankID, this.getTokenHeader())
      .toPromise()
      .then(response => response as BankBranch[])
      .catch(() => []);
  }
    newComment(objectID: number, content: string, contentType: string): Promise<boolean> {
      return this.http.post(this.apiUrl + '/generals'  + '/' + objectID + '/comment', { 'content': content ,
        'content_type': contentType}, this.getTokenHeader())
        .toPromise()
        .then(() => true)
        .catch(() => false);
    }

    getComments(objectID: number, contentType: string): Promise<Object[]> {
      return this.http.post(this.apiUrl + '/generals' + '/' + objectID + '/getComments', {'content_type': contentType},
        this.getTokenHeader())
        .toPromise()
        .then(response => response as Object[])
        .catch(() => []);
    }

  getEmployeeData(departmentId: number): Promise<Object[]> {
    return this.http.get(this.apiUrl  + '/feedbacks?departmentId=' + departmentId, this.getTokenHeader())
      .toPromise()
      .then(response => response as Object[]);
  }
}
