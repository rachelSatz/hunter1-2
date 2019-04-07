import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import { FileFeedback } from '../../_models/file-feedback.model';
import { MonthlyTransferBlock } from '../../_models/monthly-transfer-block';
import {DataTableCriteria} from '../../data-table-1/classes/data-table-criteria';
import {DataTableResponse} from '../../data-table-1/classes/data-table-response';

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

    return this.http.get(this.endPoint + '/FilesList', request)
    .toPromise()
    .then(response => response as DataTableResponse)
    .catch(() => null);

  }

  searchEmployeeData(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const request = this.getTokenHeader();

    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
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
