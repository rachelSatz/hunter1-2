import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { DataTableCriteria } from '../../data-table/classes/data-table-criteria';
import { DataTableResponse } from '../../data-table/classes/data-table-response';

@Injectable()
export class FeedbackService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/feedbacks';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getFileFeedbacks(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const request = this.getTokenHeader();

    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }

    return this.http.get(this.endPoint + '/filesList', request)
    .toPromise()
    .then(response => response as DataTableResponse)
    .catch(() => null);

  }

  getSendFeedbackByProcessId(id): Promise<any> {

    return this.http.get(this.endPoint + '/' + id + '/getSendFeedbackByProcessId', this.getTokenHeader())
      .toPromise()
      .then(response => response )
      .catch(() => null);

  }

  searchEmployeeData(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const request = this.getTokenHeader();

    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }

    return this.http.get(this.endPoint + '/recordsList', request)
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  getTransfer(mtb_id: number, sent_group_id: number, status_sent_group: string): Promise<any> {
    const request = this.getTokenHeader();
    request['params'] = {mtbId : mtb_id, sentGroupId: sent_group_id, status_sent_group: status_sent_group};
    return this.http.get(this.endPoint + '/getTransfer', request)
      .toPromise()
      .then(response => response);
  }


  downloadGroupThingFile(id: number): Promise<any> {
    return this.http.get(this.apiUrl + '/files/' + id + '/downloadFile', this.getTokenHeader())
      .toPromise()
      .then(response => response);
  }


  sendFeedback(mtbs: any, recipient: any, comment: string, criteria?: DataTableCriteria, isFailed?: boolean): Promise<any> {
    return this.http.post(this.endPoint + '/feedback',
      {mtbs: mtbs, recipient: recipient, comment: comment, criteria: this.setDataTableParams(criteria), isFailed: isFailed},
      this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  changeStatus(ids: number[] , contentType: string, status: string , criteria?: DataTableCriteria): Promise<boolean> {
    return this.http.post(this.endPoint  + '/changeStatus', { 'ids': ids ,
      'content_type': contentType, 'status': status, 'criteria':
        this.setDataTableParams(criteria)}, this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  getDetailsFeedBack(id): Promise<any> {
    return this.http.get(this.endPoint + '/' + id + '/getDetailsFeedBack' , this.getTokenHeader())
      .toPromise()
      .then(response => response )
      .catch(() => null);

  }

}
