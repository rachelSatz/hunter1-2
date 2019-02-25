import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import { FileFeedback } from '../../_models/file-feedback.model';
import { MonthlyTransferBlock } from '../../_models/monthly-transfer-block';

@Injectable()
export class FeedbackService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/feedbacks';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getFileFeedbacks(searchCriteria?: Object): Promise<FileFeedback[]> {
    
    const options = this.getTokenHeader();
    options['params'] = searchCriteria;

    return this.http.get(this.endPoint + '/FilesList', options)
    .toPromise()
    .then(response => response as FileFeedback[]);
  }

  searchEmployeeData(searchCriteria?: Object): Promise<MonthlyTransferBlock[]> {
    const request = this.getTokenHeader();
    if (searchCriteria) {
      request['params'] = searchCriteria;
    }

    return this.http.get(this.endPoint + '/RecordsList', request)
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  downloadGroupThingFile(id: number): Promise<Blob> {
    return this.http.get(this.apiUrl + '/files/' + id + '/downloadFile', this.getBlobOptions())
      .toPromise()
      .then(response => response as Blob);
  }

}
