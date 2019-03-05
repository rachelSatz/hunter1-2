import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Bank } from '../../_models/bank.model';
import { BankBranch } from '../../_models/bank-branch.model';
import { Manufacturer } from '../../_models/manufacturer.model';
import { Product } from '../../_models/product.model';


@Injectable()
export class GeneralHttpService extends BaseHttpService {
  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  readonly endPoint = this.apiUrl + '/generals';

  getBanks(withBranches?: boolean): Promise<Bank[]> {
    const request = this.getTokenHeader();
    if (withBranches) {
      request['params'] = { withBranches: withBranches };
    }

    return this.http.get(this.endPoint + '/banks', request )
      .toPromise()
      .then(response => response as Bank[])
      .catch(() => []);
  }

  newComment(objectID: number, content: string, contentType: string): Promise<boolean> {
    return this.http.post(this.endPoint  + '/' + objectID + '/comment', { 'content': content ,
      'content_type': contentType}, this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  getComments(objectID: number, contentType: string): Promise<Object[]> {
    return this.http.post(this.endPoint + '/' + objectID + '/getComments', {'content_type': contentType},
      this.getTokenHeader())
      .toPromise()
      .then(response => response as Object[])
      .catch(() => []);
  }

  getInquiries(objectID: number, contentType: string): Promise<Object[]> {
    return this.http.post(this.endPoint + '/' + objectID + '/inquiries', {'content_type': contentType},
       this.getTokenHeader())
      .toPromise()
      .then(response => response as Object[])
      .catch(() => []);
  }

  newInquiry(objectID: number, content: string, contentType: string, emails_list: any[], contact_list: any[],
             employer_id: number, file_name: string, product_code: string, product_name: string, product_type: string,
             employee_id: string, employee_name: string,
             uploadedFile?: File[]): Promise<boolean> {
    const values = {
      content: content,
      content_type: contentType,
      emails_list: emails_list,
      contact_list: contact_list,
      employer_id: employer_id,
      file_name: file_name,
      product_code: product_code,
      product_name: product_name,
      product_type: product_type,
      employee_id: employee_id,
      employee_name: employee_name
    };
    const formData = new FormData();
    formData.append('values', JSON.stringify(values));

    if (uploadedFile) {
      for (let i = 0; i <= uploadedFile.length - 1 ; i++) {
        formData.append('file' + i, uploadedFile[i]);
      }
    }
    return this.http.post(this.endPoint  + '/' + objectID +  '/newInquiry', formData
      , this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  downloadFilesInquirie(rowID: number, contentType: string): Promise<any[]> {
    return this.http.post(this.endPoint + '/' + rowID + '/downloadFilesInquirie', {'content_type': contentType},
      this.getTokenHeader())
      .toPromise()
      .then(response => response as any[])
      .catch(() => null);
  }

  addNewBankAccount(bank: any): Promise<any> {
    return this.http.put(this.endPoint  +  '/addNewBankAccount', bank , this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }
}
