import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import {UserSessionService} from '../user-session.service';
import {HttpClient} from '@angular/common/http';
import {MonthlyTransferBlock} from '../../_models/monthly-transfer-block';

@Injectable()
export class MonthlyTransferBlockService  extends BaseHttpService {
  readonly endPoint = this.apiUrl + '/mtb';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  groupList(): Promise<any> {
    return this.http.get(this.endPoint + '/groupList', this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);

  }

  getMonthlyList(processId: number): Promise<MonthlyTransferBlock[]> {
    const options = this.getTokenHeader();
    options['params'] = {processId : processId};
    return this.http.get(this.endPoint, options)
      .toPromise()
      .then(response => response as MonthlyTransferBlock[])
      .catch(response => null);

  }

  updateMTBGroup(rowIDs: number[], groupId: number): Promise<boolean> {
    return this.http.post(this.endPoint + '/updateMTBGroup', {ids: rowIDs, groupId: groupId}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  createMTBGroup(rowIDs: number[]): Promise<boolean> {
    return this.http.post(this.endPoint + '/createMTBGroup', {ids: rowIDs}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  update(type: string , val: any, Id: object): Promise<boolean> {
    return this.http.post(this.endPoint + '/Update', { params: val , type: type, Id: Id}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }











}
