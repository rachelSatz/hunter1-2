import { Injectable } from '@angular/core';
import { UserSessionService } from './user-session.service';
import { HttpClient } from '@angular/common/http';
import { BaseHttpService } from './base-http.service';
import { DataTableCriteria } from '../../data-table/classes/data-table-criteria';
import { DataTableResponse } from '../../data-table/classes/data-table-response';
import { SelectUnitService } from '../select-unit.service';

@Injectable({
  providedIn: 'root'
})
export class CalcProcessService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/calc_processes';

  constructor(userSession: UserSessionService, private http: HttpClient, private selectUnit: SelectUnitService) {
    super(userSession);
  }

  getCalcProcesses(criteria?: DataTableCriteria, noLimit?: boolean): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }
    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }
    request['params']['project_group_id'] = this.selectUnit.getProjectGroupId();
    return this.http.get(this.endPoint, request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }
}
