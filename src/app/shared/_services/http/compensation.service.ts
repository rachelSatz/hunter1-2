import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Compensation } from 'app/shared/_models/compensation.model';
import {UploadFile} from 'ngx-file-drop';


@Injectable()
export class CompensationService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/compensations';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getCompensations(searchCriteria?: Object): Promise<Compensation[]> {
    const request = this.getTokenHeader();

    if (searchCriteria) {
      request['params'] = searchCriteria;
    }

    return this.http.get(this.endPoint, request)
    .toPromise()
    .then(response => response as Compensation[])
    .catch(() => []);
  }

  newCompensation(compensation: Compensation): Promise<boolean> {
    return this.http.post(this.endPoint, compensation, this.getTokenHeader())
    .toPromise()
    .then(() => true)
    .catch(() => false);
  }

  updateCompensation(compensation: Compensation, uploadedFile?: File): Promise<boolean> {
    const values = {
      projected_balance: compensation.projected_balance,
      reported_balance: compensation.reported_balance
    };

    const formData = new FormData();
    formData.append('values', JSON.stringify(values));

    if (uploadedFile) {
      formData.append('file', uploadedFile);
    }

    return this.http.post(this.endPoint + '/update/' + compensation.id, formData, this.getTokenHeader())
    .toPromise()
    .then(() => true)
    .catch(() => false);
  }

  sendCompensations(compensation_ids: number[]): Promise<boolean> {
    return this.http.post(this.endPoint + '/send', { compensation_ids: compensation_ids }, this.getTokenHeader())
    .toPromise()
    .then(() => true)
    .catch(() => false);
  }

  newComment(compensation_id: number, content: string): Promise<boolean> {
    return this.http.post(this.endPoint + '/' + compensation_id + '/comment', { content: content }, this.getTokenHeader())
    .toPromise()
    .then(() => true)
    .catch(() => false);
  }

  getInquiries(compensationID: number): Promise<Object[]> {
    return this.http.get(this.endPoint + '/' + compensationID + '/inquiries', this.getTokenHeader())
    .toPromise()
    .then(response => response as Object[])
    .catch(() => []);
  }

  newInquiry(compensation_id: number, content: string, emails_list: string[], contact_list: number[]): Promise<boolean> {
    return this.http.post(this.endPoint + '/' + compensation_id + '/newInquiry',
      { content: content, emails_list: emails_list, contact_list: contact_list }, this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
