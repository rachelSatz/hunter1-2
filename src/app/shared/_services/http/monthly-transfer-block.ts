import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import {UserSessionService} from '../user-session.service';
import {HttpClient} from '@angular/common/http';

import {Employee} from '../../_models/employee.model';
import {DataTableResponse} from '../../data-table/classes/data-table-response';
import {DataTableCriteria} from '../../data-table/classes/data-table-criteria';

@Injectable()
export class MonthlyTransferBlockService  extends BaseHttpService {
  readonly endPoint = this.apiUrl + '/mtb';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  groupList( processId: number): Promise<any> {
    return this.http.get(this.endPoint + '/' + processId + '/groupList', this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  getMonthlyList(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const options = this.getTokenHeader();
    options['params'] = this.setDataTableParams(criteria);

    return this.http.get(this.endPoint, options)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  // createMTBGroup(rowIDs: number[], bankAccountId?: number, groupId?: number, process_id?: number): Promise<boolean> {
  //   return this.http.post(this.endPoint + '/createOrUpdateMTBGroup',
  //     {ids: rowIDs, bank_account_id: bankAccountId, groupId: groupId, process_id: process_id }, this.getTokenHeader())
  //     .toPromise()
  //     .then(response => response)
  //     .catch(response => response);
  // }

  createMTBGroup(ids: number[], productId: number, bankAccountId: number, groupName: string, confirmation: number): Promise<any> {
    return this.http.post(this.endPoint + '/createOrUpdateMTBGroup',
      {ids: ids, bank_account_id: bankAccountId, product_id: productId,
        group_name: groupName , confirmation: confirmation}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  update(type: string , val: any, Id: object): Promise<boolean> {
    return this.http.post(this.endPoint + '/update', { params: val , type: type, Id: Id}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  getEntity(processId: number, record_id: number): Promise<Employee[]> {

    const options = this.getTokenHeader();
    options['params'] = {processId : processId, recordsId: record_id};
    return this.http.get(this.endPoint + '/entity', options)
      .toPromise()
      .then(response => response as Employee[])
      .catch(response => null);
  }











}
