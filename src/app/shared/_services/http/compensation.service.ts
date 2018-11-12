import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Compensation } from 'app/shared/_models/compensation.model';
import {UploadFile} from 'ngx-file-drop';


@Injectable()
export class CompensationService extends BaseHttpService {

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

  updateCompensation(compensation: Compensation, uploadedFile?: File[], file_count?: string[]): Promise<boolean> {
    const values = {
      projected_balance: compensation.projected_balance,
      reported_balance: compensation.reported_balance,
      has_by_safebox: compensation.has_by_safebox
    };

    const formData = new FormData();
    formData.append('values', JSON.stringify(values));

    if (uploadedFile) {
        for (let i = 0; i <= uploadedFile.length - 1 ; i++) {
          formData.append('file' + i, uploadedFile[i]);
          file_count.push('file' + i);
      }
      formData.append('file_count', JSON.stringify(file_count));
    }

    return this.http.post(this.endPoint + '/update/' + compensation.id, formData, this.getTokenHeader())
    .toPromise()
    .then(() => true)
    .catch(() => false);
  }

  uploadCompensation(uploadedFile?: File): Promise<Object> {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile);


    return this.http.post(this.endPoint + '/upload_excel', formData, this.getTokenHeader())
      .toPromise()
      .then(response => response as Object)
      .catch(() => []);
    }
  }

  sendCompensations(compensation_ids: number[]): Promise<boolean> {
    return this.http.post(this.endPoint + '/send', { compensation_ids: compensation_ids }, this.getTokenHeader())
    .toPromise()
    .then(() => true)
    .catch(() => false);
  }

  newComment(compensation_id: number, content: string): Promise<boolean> {
    return this.http.post(this.endPoint + '/' + compensation_id + '/comment', { 'content': content }, this.getTokenHeader())
    .toPromise()
    .then(() => true)
    .catch(() => false);
  }

  getComments(compensationID: number): Promise<Object[]> {
    return this.http.get(this.endPoint + '/' + compensationID + '/getComments', this.getTokenHeader())
      .toPromise()
      .then(response => response as Object[])
      .catch(() => []);
  }

  getInquiries(compensationID: number): Promise<Object[]> {
    return this.http.get(this.endPoint + '/' + compensationID + '/inquiries', this.getTokenHeader())
    .toPromise()
    .then(response => response as Object[])
    .catch(() => []);
  }

  newInquiry(compensation_id: number, content: string, emails_list: any[], contact_list: any[],
             uploadedFile?: File[], file_count?: string[]): Promise<boolean> {
    const values = {
      content: content,
      emails_list: emails_list,
      contact_list: contact_list
    }

    const formData = new FormData();
    formData.append('values', JSON.stringify(values));

    if (uploadedFile) {
      for (let i = 0; i <= uploadedFile.length - 1 ; i++) {
        formData.append('file' + i, uploadedFile[i]);
        file_count.push('file' + i);
      }
      formData.append('file_count', JSON.stringify(file_count));
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
}



