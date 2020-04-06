import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import { Organization } from '../../_models/organization.model';
import {DataTableResponse} from '../../data-table/classes/data-table-response';
import {DataTableCriteria} from '../../data-table/classes/data-table-criteria';
import {ReportFilters} from '../../_models/report_manage';

@Injectable()
export class OrganizationService extends BaseHttpService {

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  readonly endPoint = this.apiUrl + '/organizations';


  getOrganizations(): Promise<Organization[]> {
    return this.http.get(this.endPoint + '/getOrganizations', this.getTokenHeader())
      .toPromise()
      .then(response => response as Organization[])
      .catch(() => null);
  }

  getOrganizationTable(criteria?: DataTableCriteria): Promise<DataTableResponse> {
    const request = this.getTokenHeader();

    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }

    return this.http.get(this.endPoint, request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }


  getReport(reportsFilters: ReportFilters): Promise<any> {
    const formData = new FormData();
    formData.append('organizationId', reportsFilters.organizationId.toString());
    formData.append('projectId' , reportsFilters.projectsId.toString());
    formData.append('employerId' , reportsFilters.employerId.toString());
    formData.append('operatorId' , reportsFilters.operatorId.toString());
    formData.append('startDate' , reportsFilters.startDate.toString());
    formData.append('endDate' , reportsFilters.endDate.toString());


    return this.http.post(this.apiUrl + '/reports/' + 'statusEmployerReport', formData, this.getTokenHeader())
      .toPromise()
      .then(response => response as any);

  }

  getOrganizationsNameAndId(): Promise<Organization[]> {
    return this.http.get(this.endPoint + '/organizationsForSelector', this.getTokenHeader())
      .toPromise()
      .then(response => response as Organization[])
      .catch(() => []);
  }

  getOrganization(id: number): Promise<Organization> {
    return this.http.get(this.endPoint + '/' + id , this.getTokenHeader())
      .toPromise()
      .then(response => response as Organization)
      .catch(() => null);
  }

  getOrganizationByOperator(id: number, projectId?: number): Promise<Organization[]> {
    const request = this.getTokenHeader();
    request['params'] = {operatorId: id, projectId: projectId};
    return this.http.get(this.endPoint + '/organizationByOperator', request)
      .toPromise()
      .then(response => response as any);
  }

  saveNewOrganization(organization: Organization): Promise<boolean> {
    return this.http.post(this.endPoint, organization, this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  updateOrganization(organization: Organization, id: number): Promise<boolean> {
    return this.http.put(this.endPoint  + '/' + id, organization, this.getTokenHeader())
      .toPromise()
      .then(response => response as boolean);
  }

}
