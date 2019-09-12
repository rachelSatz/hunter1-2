import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Compensation } from 'app/shared/_models/compensation.model';
import { DataTableResponse } from '../../data-table/classes/data-table-response';
import { DataTableCriteria } from '../../data-table/classes/data-table-criteria';

@Injectable()

export class CompensationService extends BaseHttpService {
  y = 'p';
  readonly endPoint = this.apiUrl + '/compensations';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getCompensations(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const request = this.getTokenHeader();

    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }

    return this.http.get(this.endPoint , request)
    .toPromise()
    .then(response => response as DataTableResponse)
    .catch(() => null);
  }

  getCompensation(compensationId: number): Promise<Compensation> {
    return this.http.get(this.endPoint + '/' + compensationId, this.getTokenHeader())
      .toPromise()
      .then(response => response as Compensation)
      .catch(() => null);
  }

  newCompensation(compensation: Compensation): Promise<Object> {
    return this.http.post(this.endPoint, compensation, this.getTokenHeader())
    .toPromise()
    .then(response => response as Object[])
      .catch(() => []);
  }

  updateCompensation(compensation: Compensation, uploadedFile?: File[]): Promise<boolean> {
    const values = {
      projected_balance: compensation.projected_balance,
      reported_balance: compensation.reported_balance,
      has_by_safebox: compensation.has_by_safebox,
      portal_balance: compensation.portal_balance
    };

    const formData = new FormData();
    formData.append('values', JSON.stringify(values));

    if (uploadedFile) {
        for (let i = 0; i <= uploadedFile.length - 1 ; i++) {
          formData.append('file' + i, uploadedFile[i]);
      }
    }

    return this.http.post(this.endPoint + '/update/' + compensation.id, formData, this.getTokenHeader())
    .toPromise()
    .then(() => true)
    .catch(() => false);
  }

  uploadCompensation(uploadedFile?: File, employerId?: number, val?: string): Promise<Object> {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('employerId' , employerId.toString());
      formData.append('val' , val);

    return this.http.post(this.endPoint + '/upload_excel', formData, this.getTokenHeader())
      .toPromise()
      .then(response => response as Object)
      .catch(() => []);
    }
  }

  sendCompensations(compensation_ids: number[], criteria: DataTableCriteria): Promise<any> {

    return this.http.post(this.endPoint + '/send', { compensation_ids: compensation_ids,
      searchCriteria: this.setDataTableParams(criteria)}, this.getTokenHeader())
    .toPromise()
    .then(response => response as any)
    .catch(response => response as any);

  }

  downloadPdfFile(rowID: number, hasFileFeedback: Boolean): Promise<string[]> {
    const request = this.getTokenHeader();
    request['params'] = {hasFileFeedback: hasFileFeedback};

    return this.http.get(this.endPoint + '/' + rowID + '/downloadPdfFile', request)
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  downloadFile(rowID: number, filename: string): Promise<string> {
    return this.http.post(this.endPoint + '/' + rowID + '/downloadFile', { filename: filename},
      this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  downloadExampleFile(filename: string): Promise<string> {
    return this.http.post(this.endPoint + '/downloadExampleFile', { filename: filename},
      this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  deleteFile(rowID: number, filename: string): Promise<any> {
    return this.http.post(this.endPoint + '/' + rowID + '/deleteFile', { filename: filename}
      , this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  getFollow(searchCriteria?: Object): Promise<Object> {
    const request = this.getTokenHeader();

    if (searchCriteria) {
      request['params'] = searchCriteria;
    }

    return this.http.get(this.endPoint + '/stats', request)
      .toPromise()
      .then(response => response as Object)
      .catch(() => []);
  }


  manualChangingStatus(compensation_ids: number[], criteria: DataTableCriteria):  Promise<Compensation[]> {
    return this.http.post(this.endPoint + '/updateSentStatus',
      { compensation_ids: compensation_ids,  searchCriteria: this.setDataTableParams(criteria)},
      this.getTokenHeader())
      .toPromise()
      .then(response => response as Compensation[])
      .catch(() => []);
  }

  getCompanyEmployee(employee_id: number): Promise<any> {
    const path_url = this.endPoint + '/' + employee_id +  '/companyEmployee';
    const res = this.http.get(path_url, this.getTokenHeader())
      .toPromise()
      .then(response => response);
    return res;
  }

  getfileEmployeeByEmployer(id: number): Promise<any> {
    const res = this.http.get(this.endPoint + '/' + id +  '/fileEmployeeByEmployer', this.getTokenHeader())
      .toPromise()
      .then(response => response);
    return res;
  }


  uploadExcelEmployees(uploadedFile?: File, departmentId?: number): Promise<Object> {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('department_id',  JSON.stringify(departmentId));

      return this.http.post(this.endPoint + '/uploadExcelEmployees', formData, this.getTokenHeader())
        .toPromise()
        .then(response => response as Object)
        .catch(() => []);
    }
  }
}



