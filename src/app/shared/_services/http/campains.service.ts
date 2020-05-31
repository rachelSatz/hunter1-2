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

  createCampaign(campaign: any, groups: any): Promise<any> {
    return this.http.post(this.endPoint, {campaign: campaign , groups}
      , this.getTokenHeader())
      .toPromise()
      .then(response => response as any);
  }

  updateCampaign(campaign: any, groups: any): Promise<any> {
    return this.http.post(this.endPoint + '/updateCampaign', {campaign: campaign, groups}, this.getTokenHeader())
      .toPromise()
      .then(response => response as any);
  }

  getCampaign(id: number): Promise<any> {
    return this.http.get(this.endPoint + '/' + id, this.getTokenHeader())
      .toPromise()
      .then(response => response);
  }

  getCampaigns(criteria?: DataTableCriteria, noLimit?: boolean): Promise<DataTableResponse> {
    const request = this.getTokenHeader();

    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }

    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }

    return this.http.get(this.endPoint + '/getAllCampaigns', request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  checkCampaignName(campaignName: string): Promise<boolean> {
    return this.http.post(this.endPoint + '/checkCampaignName', {campaignName: campaignName}, this.getTokenHeader())
      .toPromise()
      .then(response => response as boolean);
  }

  changeStatus(id: number, status: string): Promise<boolean> {
    return this.http.post(this.endPoint + '/changeStatus', {id: id, status: status}, this.getTokenHeader())
      .toPromise()
      .then(response => response as boolean);
  }

  getTypes(isTask?: Boolean): Promise<any> {
    return this.http.post(this.endPoint + '/getTypes' , { isTask: isTask}, this.getTokenHeader())
      .toPromise()
      .then(response => response);
  }

  getAllEmployersCampaign(campaignId): Promise<any>  {
    return this.http.get(this.endPoint + '/getAllEmployersCampaign/'  + campaignId , this.getTokenHeader())
    .toPromise()
    .then(response => response)
    .catch(response => response);
  }

}
