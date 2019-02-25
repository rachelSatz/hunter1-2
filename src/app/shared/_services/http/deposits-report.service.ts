import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import { DepositsReport } from 'app/shared/_models/deposits-report.model';


@Injectable()

export class DepositsReportService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/deposits';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getDepositsReport(searchCriteria?: Object): Promise<DepositsReport[]> {
    const request = this.getTokenHeader();

    if (searchCriteria) {
      request['params'] = searchCriteria;
    }

    return this.http.get(this.endPoint, request)
      .toPromise()
      .then(response => response as DepositsReport[])
      .catch(() => []);
  }

  newDepositsReport(depositsReport: DepositsReport): Promise<any> {
    return this.http.post(this.endPoint, depositsReport, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  manualChangingStatus(deposits_report_ids: number[]):  Promise<any> {
    return this.http.post(this.endPoint + '/updateSentStatus',
      { deposits_report_ids: deposits_report_ids}
      , this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  getFile(id: number): Promise<any> {

    return this.http.get(this.endPoint + '/getFile/' + id, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  uploadFile(description: string, id: number, uploadedFile?: File): Promise<boolean> {

    const formData = new FormData();
    formData.append('description', description);

    formData.append('file', uploadedFile);


    return this.http.post(this.endPoint + '/uploadFile/' + id, formData, this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
