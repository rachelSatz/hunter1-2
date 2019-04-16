import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import {Invoice} from 'app/shared/_models/invoice.model';
import {DataTableResponse} from '../../data-table/classes/data-table-response';
import {DataTableCriteria} from '../../data-table/classes/data-table-criteria';


@Injectable()
export class InvoiceService  extends BaseHttpService {

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  readonly endPoint = this.apiUrl + '/invoices';

  getInvoices(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const request = this.getTokenHeader();

    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }

    return this.http.get(this.endPoint, request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  createInvoice(content: string): Promise<Invoice[]> {
    return this.http.post(this.endPoint + '/create_invoice', content, this.getTokenHeader())
      .toPromise()
      .then(response => response as Invoice[])
      .catch(() => []);
  }


  newComment(invoice_id: number, content: string): Promise<boolean> {
    return this.http.post(this.endPoint + '/' + invoice_id + '/comment', { 'content': content }, this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  getComments(invoiceID: number): Promise<Object[]> {
    return this.http.get(this.endPoint + '/' + invoiceID + '/getComments', this.getTokenHeader())
      .toPromise()
      .then(response => response as Object[])
      .catch(() => []);
  }

  getInvoiceRemarks(invoice_id: number): Promise<Object> {
    return this.http.get(this.endPoint + '/' + invoice_id + '/getRemarks', this.getTokenHeader())
      .toPromise()
      .then(response => response as Object)
      .catch(() => []);
  }

  uploadFinanceExcel(uploadedFile?: File): Promise<Object> {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      return this.http.post(this.endPoint + '/uploadFinanceExcel', formData, this.getTokenHeader())
        .toPromise()
        .then(response => response as Object)
        .catch(() => []);
    }
  }

  downloadExampleFile(filename: string): Promise<string> {
    return this.http.post(this.endPoint + '/downloadExampleFile', { filename: filename},
      this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }
}
