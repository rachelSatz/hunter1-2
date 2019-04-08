import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Process, ViewProcess } from '../../_models/process.model';
import { ProcessDetails } from '../../_models/process-details.model';
import { ProductPayment } from '../../_models/product-payment.model';
import { TransmissionData } from '../../_models/transmission-data.model';
import { SendFile } from '../../_models/send-file.model';
import { BankBranch } from '../../_models/bank-branch.model';
import { Manufacturer } from '../../_models/manufacturer.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {DataTableResponse} from '../../data-table-1/classes/data-table-response';
import {DataTableCriteria} from '../../data-table-1/classes/data-table-criteria';

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

    return this.http.get( this.endPoint + '/FilesList', options)
      .toPromise()
      .then(response => response as DataTableResponse);
  }

  downloadMasav(id: number): Promise<string> {
    return this.http.post(this.endPoint + '/downloadMasav', {'processId': id}, this.getTokenHeader())

      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  downloadExcel(id: number): Promise<string> {
    return this.http.post(this.endPoint + '/downloadMasavExcel', {'processId': id}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }


  newProcess(values: any, file?: File, fileDeposition?: File ): Promise<boolean> {
    const formData = new FormData();
    formData.append('departmentId', values.departmentId);
    if (values.isDirect != null) {
      formData.append('isDirect', values.isDirect);
    }
    formData.append('month', values.month);
    formData.append('processName', values.processName);
    formData.append('year', values.year);

    if (file) {
      formData.append('file', file);
    }
    if (fileDeposition) {
      formData.append('attachments', fileDeposition);
    }

    return this.http.post(this.endPoint + '/UploadFile',  formData, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  update(type: string , val: any, fileId: object): Promise<boolean> {
    return this.http.post(this.endPoint + '/Update', { params: val , type: type, fileId: fileId}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  transfer(processID: any, name: string): Promise<any> {
    return this.http.post(this.endPoint  + '/Transmit', { [name]: processID} , this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  getUploadFile(processId: number): Observable<any> {
    const options = this.getTokenHeader();
    options['params'] = { processId: processId };
    return this.http.get(this.endPoint + '/UploadFile',  options)
      .pipe( map((response: Response) => response));
  }

  getUploadFileDone(processId: number): Promise<ProcessDetails> {
    const options = this.getTokenHeader();
    options['params'] = {processId: processId};
    return this.http.get(this.endPoint + '/UploadFile',  options)
      .toPromise()
      .then(response => response as ProcessDetails)
      .catch(response => response);
  }

  getPaymentMailOnCompletion(processId: number): Promise<object> {
    return this.http.post(this.endPoint  + '/PaymentMailOnCompletion', { processId: processId}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  sendEmail(processId: number, recipient: any[]): Promise<string> {
    return this.http.post(this.endPoint + '/SendPaymentsInstruction' ,
      {processId: processId, recipient: recipient},
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

  uploadRef(uploadedFile: File, fileId: number): Promise<Object> {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      return this.http.post(this.endPoint + '/' + fileId + '/UploadRef', formData, this.getTokenHeader())
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

  unlockProcessFiles(process: any): Promise<Object> {
      return this.http.post(this.endPoint + '/UnlockProcessFiles', process, this.getTokenHeader())
        .toPromise()
        .then(response => response as Object)
        .catch(() => []);
  }

  updateDepositDate(processId: number, depositDate: string): Promise<any> {
    return this.http.post(this.endPoint + '/UpdateDepositDate', {processId: processId, depositDate: depositDate}, this.getTokenHeader())
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

}

