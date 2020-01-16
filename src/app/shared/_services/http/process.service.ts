import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Process,  } from '../../_models/process.model';
import { ProcessDetails } from '../../_models/process-details.model';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {DataTableResponse} from '../../data-table/classes/data-table-response';
import {DataTableCriteria} from '../../data-table/classes/data-table-criteria';

@Injectable()
export class ProcessService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/processes';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getProcess(processID: number): Promise<Process> {
    return this.http.get(this.endPoint + '/' + processID, this.getTokenHeader())
      .toPromise()
      .then(response => response as Process);
  }

  getProcesses(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const options = this.getTokenHeader();
    options['params'] = this.setDataTableParams(criteria);

    return this.http.get(this.endPoint, options)
      .toPromise()
      .then(response => response as DataTableResponse);
  }

  getFilesList(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const options = this.getTokenHeader();
    options['params'] = this.setDataTableParams(criteria);

    return this.http.get( this.endPoint + '/filesList', options)
      .toPromise()
      .then(response => response as DataTableResponse);
  }

  downloadPaymentsInstruction(id: number, planId?: number): Promise<any> {
    return this.http.post(this.endPoint + '/downloadPaymentsInstruction', {'processId': id, 'planId': planId},
      this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  newProcess(values: any, file?: File[], fileDeposition?: File, isCreate = false): Promise<boolean> {
    const formData = new FormData();
    formData.append('departmentId', values.departmentId);
    if (values.isDirect != null) {
      formData.append('isDirect', values.isDirect);
    }
    formData.append('month', values.month);
    formData.append('processName', values.processName);
    formData.append('year', values.year);

    if (file) {
      for (let i = 0; i <= file.length - 1 ; i++) {
        formData.append('file', file[i]);
      }
    }

    if (fileDeposition) {
      formData.append('attachments', fileDeposition);
    }
    if (isCreate) {
      return this.http.post(this.endPoint + '/upload_employee_file',  formData, this.getTokenHeader())
        .toPromise()
        .then(response => response)
        .catch(response => response);
    }
    return this.http.post(this.endPoint + '/uploadFile',  formData, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  update(type: string , val: any, file_id: any, criteria: DataTableCriteria ): Promise<boolean> {
    return this.http.post(this.endPoint + '/update',
      { params: val , type: type, file_id : file_id, searchCriteria: this.setDataTableParams(criteria)}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

   transfer(processID: any, name: string, criteria?: DataTableCriteria): Promise<any> {

    const data = criteria ? { [name]: processID,
      searchCriteria: this.setDataTableParams(criteria)} : {[name]: processID};

    return this.http.post(this.endPoint  + '/transmit', data , this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  getUploadFile(processId: number): Observable<any> {
    const options = this.getTokenHeader();
    options['params'] = { processId: processId };
    return this.http.get(this.endPoint + '/uploadFile',  options)
      .pipe( map((response: Response) => response));
  }

  getUploadFileDone(processId: number): Promise<ProcessDetails> {
    const options = this.getTokenHeader();
    options['params'] = {processId: processId};
    return this.http.get(this.endPoint + '/uploadFile',  options)
      .toPromise()
      .then(response => response as ProcessDetails)
      .catch(response => response);
  }

  getPaymentMailOnCompletion(processId: number): Promise<object> {
    return this.http.post(this.endPoint  + '/paymentMailOnCompletion', { processId: processId}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }
  sendEmail(processId: number, recipient: any[], planId?: number): Promise<string> {
    return this.http.post(this.endPoint + '/sendPaymentsInstruction' ,
      {processId: processId, recipient: recipient, planId: planId},
      this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);

  }

  downloadFileProcess(processId: number): Promise<any> {
    return this.http.get(this.endPoint + '/' + processId + '/downloadFileProcess', this.getTokenHeader())
      .toPromise()
      .then(response => response as any)
      .catch(response => response as any);
  }

  uploadRef(uploadedFile: File, filesList: any, criteria: DataTableCriteria, processId: number): Promise<Object> {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('searchCriteria', JSON.stringify(this.setDataTableParams(criteria)));
      formData.append('filesList', JSON.stringify(filesList));

      return this.http.post(this.endPoint + '/' + processId +  '/uploadRef', formData, this.getTokenHeader())
        .toPromise()
        .then(response => response as Object)
        .catch(() => []);
    }
  }

  downloadFile(rowID: number): Promise<string> {
    return this.http.get(this.endPoint + '/' + rowID + '/downloadFile', this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  unlockProcessFiles(process: any,  criteria: DataTableCriteria, comment: string): Promise<Object> {

    return this.http.post(this.endPoint + '/unlockProcessFiles',
      {filesList: process, searchCriteria: this.setDataTableParams(criteria), comment: comment}, this.getTokenHeader())
        .toPromise()
        .then(response => response as Object)
        .catch(() => []);
  }

  updateDepositDate(processId: number, depositDate: string): Promise<any> {
    return this.http.post(this.endPoint + '/updateDepositDate', {processId: processId, depositDate: depositDate}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  deleteProcess(processId: number, planId?: number): Promise<any> {
    return this.http.delete(this.endPoint + '/' + processId,  this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  regularFix(id: number, mtb: any): Promise<any> {
    return this.http.post(this.endPoint + '/regularFix/' +  id, mtb , this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  positiveNegativeFix(ids: number[]): Promise<any> {
    return this.http.post(this.endPoint + '/positiveNegativeFix' , {'mtbIds' : ids} , this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  changeFileToNegative(ids: number[], name: string, departmentId: number, file?: File): Promise<any> {
    const formData = new FormData();
    formData.append(name, JSON.stringify(ids));
    formData.append('attachment', file);
    formData.append('department_id', departmentId.toString());

    return this.http.post(this.endPoint + '/changeFileToNegative' , formData , this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  setApprovalFile(id): Promise<boolean> {
    return this.http.post(this.endPoint + '/' + id + '/setApprovalFile' , {},  this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  getCommentBroadcast(id): Promise<string> {
    return this.http.get(this.endPoint + '/' + id + '/getCommentBroadcast' ,  this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }
}

