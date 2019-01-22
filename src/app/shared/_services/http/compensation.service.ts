import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Compensation } from 'app/shared/_models/compensation.model';


@Injectable()

export class CompensationService extends BaseHttpService {
  y= 'p'
  readonly endPoint = this.apiUrl + '/compensations';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getCompensations(searchCriteria?: Object): Promise<Compensation[]> {
    const request = this.getTokenHeader();

    if (searchCriteria) {
      request['params'] = searchCriteria;
    }

    return this.http.get(this.endPoint, request)
    .toPromise()
    .then(response => response as Compensation[])
    .catch(() => []);
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

  uploadCompensation(uploadedFile?: File, employerId?: number): Promise<Object> {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('employerId' , employerId.toString());

    return this.http.post(this.endPoint + '/upload_excel', formData, this.getTokenHeader())
      .toPromise()
      .then(response => response as Object)
      .catch(() => []);
    }
  }

  sendCompensations(compensation_ids: number[]): Promise<any> {
    return this.http.post(this.endPoint + '/send', { compensation_ids: compensation_ids }, this.getTokenHeader())
    .toPromise()
    .then(response => response as any)
    .catch(response => response as any);

  }



  getInquiries(compensationID: number): Promise<Object[]> {
    return this.http.get(this.endPoint + '/' + compensationID + '/inquiries', this.getTokenHeader())
    .toPromise()
    .then(response => response as Object[])
    .catch(() => []);
  }

  newInquiry(compensation_id: number, content: string, emails_list: any[], contact_list: any[],
             uploadedFile?: File[]): Promise<boolean> {
    const values = {
      content: content,
      emails_list: emails_list,
      contact_list: contact_list
    };

    const formData = new FormData();
    formData.append('values', JSON.stringify(values));

    if (uploadedFile) {
      for (let i = 0; i <= uploadedFile.length - 1 ; i++) {
        formData.append('file' + i, uploadedFile[i]);
      }
    }

    return this.http.post(this.endPoint + '/' + compensation_id + '/newInquiry', formData
      , this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  downloadPdfFile(rowID: number): Promise<string> {
    return this.http.get(this.endPoint + '/' + rowID + '/downloadPdfFile', this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  downloadFilesInquirie(rowID: number): Promise<any[]> {
    return this.http.get(this.endPoint + '/' + rowID + '/downloadFilesInquirie', this.getTokenHeader())
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

  // downloadPdfFile(rowID: number): any {
  //   return this.http.get(this.endPoint + '/' + rowID + '/downloadPdfFile', this.getTokenHeader())
  //     .toPromise()
  //     .then(response => response)
  //     .catch(() => null);
  // }

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

  manualChangingStatus(compensation_ids: number[], searchCriteria?: Object):  Promise<Compensation[]> {
    return this.http.post(this.endPoint + '/updateSentStatus',
      { compensation_ids: compensation_ids,
        searchCriteria: searchCriteria
      }
    , this.getTokenHeader())
      .toPromise()
      .then(response => response as Compensation[])
      .catch(() => []);
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

  getErrorMessage(compensationID: number): Promise<Compensation> {
    return this.http.get(this.endPoint + '/' + compensationID + '/getErrorMessage', this.getTokenHeader())
      .toPromise()
      .then(response => response as Compensation)
      .catch(() => null);
  }


  getMasav(): Promise<any> {
    const request = this.getBlobOptions();

    const x = ['1', 'l', '3'];
    request['params'] = x;


    return this.http.get(this.endPoint + '/masav', request)
    .toPromise()
    .then(response => response as any)
    .catch(() => null);
  }
}



