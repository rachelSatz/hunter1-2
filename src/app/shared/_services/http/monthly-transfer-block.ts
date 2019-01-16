import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import {UserSessionService} from '../user-session.service';
import {HttpClient} from '@angular/common/http';

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
  updateMTBGroup(rowIDs: number[], groupId: number): Promise<boolean> {
    return this.http.post(this.endPoint + '/updateMTBGroup', {ids: rowIDs, groupId: groupId}, this.getTokenHeader())
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
