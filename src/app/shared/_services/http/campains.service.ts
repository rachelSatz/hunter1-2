import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import { DataTableCriteria } from '../../data-table/classes/data-table-criteria';
import { DataTableResponse } from '../../data-table/classes/data-table-response';


@Injectable()
export class CampaignsService extends BaseHttpService {

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  readonly endPoint = this.apiUrl + '/campaigns';

  getCampaign(id: number): Promise<any> {
    return this.http.get(this.endPoint + '/' + id, this.getTokenHeader())
      .toPromise()
      .then(response => response);
  }

  getCampaigns(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const request = this.getTokenHeader();

    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }

    return this.http.get(this.endPoint , request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getTypes(): Promise<any> {
    return this.http.get(this.endPoint + '/getTypes' , this.getTokenHeader())
      .toPromise()
      .then(response => response);
  }
}
