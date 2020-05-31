import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Process,  } from '../../_models/process.model';
import { ProcessDetails } from '../../_models/process-details.model';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataTableResponse } from '../../data-table/classes/data-table-response';
import { DataTableCriteria } from '../../data-table/classes/data-table-criteria';

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

  getFilesList(criteria: DataTableCriteria, is_reference?: boolean): Promise<DataTableResponse> {
    const options = this.getTokenHeader();
    options['params'] =  this.setDataTableParams(criteria);

    options['params']['is_reference'] = is_reference;



    return this.http.get( this.endPoint + '/filesList', options)
      .toPromise()
      .then(response => response as DataTableResponse);
  }

  deletePlanTask(processId: number): Promise<any> {
    return this.http.post(this.endPoint + '/deletePlanTask', { 'processId': processId},
      this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  downloadPaymentsInstruction(id: number, filesList?: any, criteria?: DataTableCriteria): Promise<any> {

    return this.http.post(this.endPoint + '/downloadPaymentsInstruction', {'processId': id,
        filesList: filesList,
        criteria: this.setDataTableParams(criteria)},
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

  update(type: string , val: any, file_id: any, criteria: DataTableCriteria, processId?: number ): Promise<boolean> {
    return this.http.post(this.endPoint + '/update',
      { params: val , type: type, file_id : file_id, processId: processId,
        searchCriteria: this.setDataTableParams(criteria)
      }, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  updateProcess(type: any, file_id: any, criteria: DataTableCriteria ): Promise<boolean> {
    return this.http.post(this.endPoint + '/updateProcess',
      { type: type , file_id : file_id,
        searchCriteria: this.setDataTableParams(criteria)
      }, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }


  updateDate(type: string , val: any, file_id: any, criteria: DataTableCriteria, process_id: number,
         files: any ): Promise<boolean> {
    return this.http.post(this.endPoint + '/update',
      { params: val , type: type, file_id : file_id,
        searchCriteria: this.setDataTableParams(criteria), files: files, processId: process_id
      }, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  checkIsDate( processId: number ): Promise<boolean> {
    return this.http.post(this.endPoint + '/checkIsDate',
      {processId: processId
      }, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  updatePaymentType(employerId: number, paymentType: string ): Promise<boolean> {
    return this.http.post(this.endPoint + '/updatePaymentType',
      { employerId: employerId , paymentType: paymentType}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

   transfer(processID: any, name: string, criteria?: DataTableCriteria): Promise<any> {

    const data = criteria ? { [name]: processID, searchCriteria: this.setDataTableParams(criteria)

    } : {[name]: processID, };


     return this.http.post(this.endPoint + '/transmit', data, this.getTokenHeader())
       .toPromise()
       .then(response => response)
       .catch(response => response);
  }

  transfer_new(processId: number): Promise<any> {
    return this.http.post(this.endPoint + '/transmit', {processId: processId}, this.getTokenHeader())
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

  sendEmail(processId: number, recipient: any[], filesList?: any,  criteria?: DataTableCriteria): Promise<string> {
    return this.http.post(this.endPoint + '/sendPaymentsInstruction',
      {processId: processId, recipient: recipient, criteria: this.setDataTableParams(criteria), filesList: filesList
      },
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

  uploadsRef(files: File[], processId: number): Promise<Object> {
      const formData = new FormData();
      if (files) {
        for (let i = 0; i <= files.length - 1 ; i++) {
          formData.append('file', files[i]);
        }
      }

      return this.http.post(this.endPoint + '/' + processId +  '/uploadsRef', formData, this.getTokenHeader())
        .toPromise()
        .then(response => response as Object)
        .catch(() => []);

  }

  downloadFile(rowID: number): Promise<string> {
    return this.http.get(this.endPoint + '/' + rowID + '/downloadFile', this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  unlockProcessFiles(process: any,  criteria: DataTableCriteria, comment: string, processId: number): Promise<Object> {

    return this.http.post(this.endPoint + '/unlockProcessFiles',
      {filesList: process, searchCriteria: this.setDataTableParams(criteria),
        comment: comment, processId: processId }, this.getTokenHeader())
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

  deleteProcess(processId: number): Promise<any> {
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


  authorizationReceiptCertificate(id): Promise<boolean> {
    return this.http.post(this.endPoint + '/' + id + '/authorizationReceiptCertificate' , {},  this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }


  deleteRefDocument(processId: number, filename: string): Promise<any> {
    return this.http.post(this.endPoint + '/' + processId + '/deleteRefDocument', { filename: filename}
      , this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  downloadRefDocument(processId: number, filename: string): Promise<any> {
    return this.http.post(this.endPoint + '/' + processId + '/downloadRefDocument', { filename: filename}
      , this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  getRefDocument(processId: number): Promise<any> {
    return this.http.get(this.endPoint + '/' + processId + '/getRefDocument', this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  setRecords(id: number, filesList?: any, criteria?: DataTableCriteria): Promise<any> {

    return this.http.post(this.endPoint + '/setRecords', {'processId': id,
        filesList: filesList,
        criteria: this.setDataTableParams(criteria)},
      this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  getGroupThingInProcess(id: number): Promise<any> {
    return this.http.post(this.endPoint + '/getGroupThingInProcess', {'processId': id} , this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

}

