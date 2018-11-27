import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import {Invoice} from 'app/shared/_models/invoice.model';


@Injectable()
export class InvoiceService  extends BaseHttpService {

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  readonly endPoint = this.apiUrl + '/invoices';

  getInvoices(): Promise<Invoice[]> {
    return this.http.get(this.endPoint, this.getTokenHeader())
      .toPromise()
      .then(response => response as Invoice[])
      .catch(() => []);
  }

  createInvoice(content: string): Promise<Invoice[]> {
    return this.http.post(this.endPoint + '/create_invoice', content, this.getTokenHeader())
      .toPromise()
      .then(response => response as Invoice[])
      .catch(() => []);
  }
}
