import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import { Bank } from '../../_models/bank.model';
import { DataTableCriteria } from 'app/shared/data-table/classes/data-table-criteria';


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

  newComment(objects: number[], content: string, contentType: string, criteria?: DataTableCriteria ): Promise<boolean> {
    return this.http.post(this.endPoint  + '/comment', { 'content': content ,
      'content_type': contentType, 'ids': objects, 'criteria': this.setDataTableParams(criteria)}, this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  getComments(objects: number[], contentType: string): Promise<Object[]> {
    return this.http.post(this.endPoint + '/getComments',
      {'content_type': contentType, ids: objects},
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
             employee_id: string, employee_name: string, amount: number, action: string, activeContentType: string, isAttachFile: boolean,
             company_id: string,
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
      employee_name: employee_name,
      amount: amount,
      action: action,
      activeContentType: activeContentType,
      company_id: company_id,
      is_attach_file: isAttachFile

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

  updateBank(bank: any , id: number) {
    return this.http.put(this.endPoint  +  '/updateBanks/' +  id, bank , this.getTokenHeader())
      .toPromise()
      .then(response => response as any)
      .catch(() => null);
  }

  addNewBankAccount(bank: any, planId?: number): Promise<any> {
    return this.http.put(this.endPoint  +  '/addNewBankAccount', {bank: bank, planId: planId}, this.getTokenHeader())
      .toPromise()
      .then(response => response as any)
      .catch(() => null);
  }
}
