import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import { DepositsReport } from 'app/shared/_models/deposits-report.model';
import {Compensation} from '../../_models/compensation.model';


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

  newDepositsReport(depositsReport: DepositsReport): Promise<Object> {
    return this.http.post(this.endPoint, depositsReport, this.getTokenHeader())
      .toPromise()
      .then(response => response as Object[])
      .catch(() => []);
  }

  manualChangingStatus(deposits_report_ids: number[]):  Promise<Compensation[]> {
    return this.http.post(this.endPoint + '/updateSentStatus',
      { deposits_report_ids: deposits_report_ids}
      , this.getTokenHeader())
      .toPromise()
      .then(response => response as Compensation[])
      .catch(() => []);
  }
}
