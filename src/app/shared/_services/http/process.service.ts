import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Process } from '../../_models/process.model';
import { ProcessDetails } from '../../_models/process-details.model';
import { ProductPayment } from '../../_models/product-payment.model';
import { TransmissionData } from '../../_models/transmission-data.model';
import { SendFile } from '../../_models/send-file.model';
import { BankBranch } from '../../_models/bank-branch.model';
import { Manufacturer } from '../../_models/manufacturer.model';

@Injectable()
export class ProcessService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/process';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getProcess(processID: number): Promise<Process> {

    return this.http.get(this.endPoint + '/' + processID, this.getTokenHeader())
      .toPromise()
      .then(response => response as Process);
  }
  getProcesses(searchCriteria?: Object): Promise<Process[]> {
    const options = this.getTokenHeader();
    options['params'] = searchCriteria;

    return this.http.get(this.endPoint, options)
      .toPromise()
      .then(response => response as Process[]);
  }

  newProcess(values: Object, file?: File): Promise<boolean> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(values));

    if (file) {
      formData.append('file', file);
    }

    return this.http.post(this.endPoint, formData, this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  getProcessDetail(processID: number): Promise<ProcessDetails> {
    return this.http.get(this.endPoint + '/' + processID + '/details', this.getTokenHeader())
      .toPromise()
      .then(response => response as ProcessDetails);
  }

  getEmployeePayments(searchCriteria: Object): Promise<Object[]> {
    const options = this.getTokenHeader();
    options['params'] = searchCriteria;

    return this.http.get(this.endPoint + '/employee', options)
      .toPromise()
      .then(response => response as Object[]);
  }
getManufacturerByprocess(processID: number): Promise<Manufacturer[]> {
  const options = this.getTokenHeader();
    return this.http.get(this.endPoint + '/' + processID + '/Manufacturer', options)
      .toPromise()
      .then(response => response as Manufacturer[]);
}
  getProductPayments(processID: number, searchCriteria?: Object): Promise<Object[]> {

    const options = this.getTokenHeader();
    if (searchCriteria) {
      options['params'] = searchCriteria;
    }

    return this.http.get(this.endPoint + '/' + processID + '/product', options)
      .toPromise()
      .then(response => response as ProductPayment[]);
  }

  launchTransmission(processID: number, data: TransmissionData): Promise<any> {
    return this.http.post(this.endPoint + '/' + processID + '/transmission', data, this.getTokenHeader())
      .toPromise()
      .then(response => response as any);
  }

  updatetransmission(processID: number): Promise<any> {
    return this.http.put(this.endPoint + '/' + processID + '/transmission', this.getTokenHeader())
      .toPromise()
      .then(response => response as any);
  }

  loadTransmissionTableData(processID: number): Promise<SendFile[]> {
    return this.http.get(this.endPoint + '/' + processID + '/transmission', this.getTokenHeader())
      .toPromise()
      .then(response => response as SendFile[])
      .catch(() => []);
  }

  getTransmissionFileDetails(fileID: number): Promise<any[]> {
    return this.http.get(this.endPoint + '/file/' + fileID, this.getTokenHeader())
      .toPromise()
      .then(response => response as any[]);
  }

  postCreateBankFrom(payment: any): Promise<number> {
    const body = {
      processId: payment.process.id,
      fileId: payment.file.id,
    };

    return this.http.post(this.apiUrl + '/CreateBankFrom', body, this.getTokenHeader())
      .toPromise()
      .then(response => response as number);
  }

  postBankNumbers(payment: any, All: Boolean = false): Promise<any[]> {

    const body = {
      processId: payment.process.id,
      fileId: payment.file.id,
      GetAll: All,
    };

    return this.http.post(this.apiUrl + '/bank/numbers', body, this.getTokenHeader())
      .toPromise()
      .then(response => response as any[]);
  }

  postBankBranchNumbers(payment: any, bankNumber: number, All: Boolean = false): Promise<any[]> {

    const body = {
      processId: payment.process.id,
      AutoId: payment.file.employer.id,
      bankId: bankNumber,
      fileId: payment.file.id,
      GetAll: All,
    };

    return this.http.post(this.apiUrl + '/bank/branch/numbers', body, this.getTokenHeader())
      .toPromise()
      .then(response => response as any[]);
  }

  postBankAccountNumbers(payment: any, bankNumber: number, branchNumber: number, manual: Boolean = false): Promise<any[]> {

    const body = {
      processId: payment.process.id,
      AutoId: payment.file.employer.id,
      bankId: bankNumber,
      branchId: branchNumber,
      fileId: payment.file.id,
      manual: manual,
    };

    return this.http.post(this.apiUrl + '/bank/account/numbers', body, this.getTokenHeader())
      .toPromise()
      .then(response => response as any[]);
  }

  postNewBankDetails(payment: any, bankNumber: number, branchNumber: number,
                     accountNumber: number, select: number, manual: Boolean = false): Promise<any[]> {

    const body = {
      AutoId: payment.file.employer.id,
      bankId: bankNumber,
      branchId: branchNumber,
      fileId: payment.file.id,
      accountNumber: accountNumber,
      selection: select - 1,
      manual: manual,
    };
    return this.http.post(this.apiUrl + '/bank/final', body, this.getTokenHeader())
      .toPromise()
      .then(response => response as any[]);
  }


  storeComment(payment: any, remark: string): Promise<any[]> {
    const body = {
      processId: payment.process.id,
      remarkManualId: payment.file.id,
      remarkManualValue: remark,
      AutoID: payment.file.employer.id,
    };

    return this.http.post(this.endPoint + '/' + payment.process.id + '/comment', body,
      this.getTokenHeader())
      .toPromise()
      .then(response => response as any[]);
  }

   postTransition(payment: any, checklist?: any, Singature?: string): Promise<any> {

     let monthsPaysIds;
     if (checklist == null) {
      monthsPaysIds = [];
     } else {
       monthsPaysIds = checklist.map(item => item.fileId);
     }
     const body = {
       processId: payment.id,
       employerId: payment.employer.id,
       monthsPaysIds: monthsPaysIds,
       signature: Singature,
     };

     return this.http.post(this.endPoint + '/' + payment.id + '/transmission/transmit', body,
       this.getTokenHeader())
       .toPromise()
       .then(response => response as any);
   }

  postNewDateDetails(payment: any, date: string): Promise<any[]> {
    const body = {
      processId: payment.process.id,
      date: date,
      AutoID: payment.file.employer.id,
      fileId: payment.file.id,
    };

    return this.http.post(this.endPoint + '/' + payment.process.id + '/date', body, this.getTokenHeader())
      .toPromise()
      .then(response => response as any[]);
  }

  postKeepHaveNegativeProcess(processId: number, KeepHaveNegativeProcess: boolean) {
    const body = {
      processId: processId,
      KeepHaveNegativeProcess: KeepHaveNegativeProcess
    };
    return this.http.post(this.endPoint + '/KeepHaveNegativeProcess', body, this.getTokenHeader())
      .toPromise()
      .then(response => response);
  }

  closeAllProcess(processId: number, paysIds: number[], close: boolean): Promise<any> {

    const body = {
      processId: processId,
      MonthsPaysIds: paysIds,
      Close: close
    };

    return this.http.post(this.endPoint + '/closeAll', body, this.getTokenHeader())
      .toPromise()
      .then(response => response);
  }

  updateEmployerBankBranchProcess(bankBranch: BankBranch, process: number): Promise<any[]> {
    const body = {
      bankBranch: bankBranch,
    };
    return this.http.put(this.apiUrl + '/EmployerBankBranchProcess/' + process, bankBranch, this.getTokenHeader())
    .toPromise()
    .then(response => response  as any[]);
  }

  getUploadFile(processId: number): Promise<any> {
    const request = this.getTokenHeader();

      request['processId'] = processId;

    return this.http.get(this.endPoint + '/UploadFile', request)
      .toPromise()
      .then(response => response  as any)
      .catch(response => response  as any);
  }

  getEmailUser(): Promise<object> {
    return this.http.get(this.apiUrl  + '/user_email', this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }


  uploadProcess(file?: File): Promise<boolean> {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      return this.http.post(this.endPoint + '/uploadProcess', formData, this.getTokenHeader())
        .toPromise()
        .then(() => true)
        .catch(() => false);
    }
  }
}

