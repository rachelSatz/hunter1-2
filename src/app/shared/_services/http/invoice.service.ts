import { Injectable } from '@angular/core';
import { UserSessionService } from './user-session.service';
import { HttpClient } from '@angular/common/http';
import { BaseHttpService } from './base-http.service';
import { DataTableCriteria } from '../../data-table/classes/data-table-criteria';
import { DataTableResponse } from '../../data-table/classes/data-table-response';
import { InvoiceStatus, ManualInvoice } from '../../_models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/invoices';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getInvoices(criteria?: DataTableCriteria, noLimit?: boolean): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      if (criteria.filters['status']) {
        criteria.filters['status'] = criteria.filters['status'].toString();
      }
      request['params'] = this.setDataTableParams(criteria);
    }
    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }
    return this.http.get(this.endPoint, request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getNewEmployersIncomes(criteria?: DataTableCriteria, noLimit?: boolean): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }
    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }
    return this.http.get(this.endPoint + '/getNewEmployersIncomes', request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getChargedEmployers(criteria?: DataTableCriteria, noLimit?: boolean): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }
    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }
    return this.http.get(this.endPoint + '/getChargedEmployersTable', request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getZeroPaymentEmployers(criteria?: DataTableCriteria, noLimit?: boolean): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }
    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }
    return this.http.get(this.endPoint + '/getZeroPaymentEmployersTable', request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getNoPaymentEmployers(criteria?: DataTableCriteria, noLimit?: boolean): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }
    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }
    return this.http.get(this.endPoint + '/getNoPaymentEmployersTable', request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getManuallyChargedEmployers(criteria?: DataTableCriteria, noLimit?: boolean): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }
    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }
    return this.http.get(this.endPoint + '/getManuallyEmployersTable', request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }
  getNeedToChargeEmployersTable(criteria?: DataTableCriteria, noLimit?: boolean): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }
    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }
    return this.http.get(this.endPoint + '/getNeedToChargeEmployersTable', request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }


  getEmployerInvoices(criteria?: DataTableCriteria, idEmployer?: number, noLimit?: boolean): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
      request['params']['employer_id'] = idEmployer;
    }

    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }
    return this.http.get(this.endPoint + '/getEmployerInvoices', request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getInvoiceDetails(invoice_id: number): Promise<Object> {
    return this.http.get(this.endPoint + '/getInvoiceDetails?id=' + invoice_id, this.getTokenHeader())
      .toPromise()
      .then(response => response as Object)
      .catch(() => []);
  }

  setInvoiceStatus(invoiceId: number, status: string) {
    return this.http.post(this.endPoint + '/' + invoiceId + '/setStatus', {'status': status}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  downloadInvoicesToExcel(criteria: DataTableCriteria): Promise<string> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }
    return this.http.get(this.endPoint + '/downloadInvoicesToExcel', request)
      .toPromise()
      .then(response => response as string)
      .catch(() => null);
  }

  createManualInvoice(manualInvoice: ManualInvoice): Promise<string> {
    return this.http.post(this.endPoint + '/createManualInvoice', manualInvoice, this.getTokenHeader())
      .toPromise()
      .then(response => response as string)
      .catch(() => null);
  }

  createTaxInvoices(invoiceIds: number[], criteria: DataTableCriteria, date: any): Promise<string> {
    return this.http.post(this.endPoint + '/createTaxInvoices',
      { invoiceIds: invoiceIds, data: date,  criteria: this.setDataTableParams(criteria)}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  createTransactionInvoices(invoiceIds: number[], criteria: DataTableCriteria, date: any): Promise<string> {
    return this.http.post(this.endPoint + '/createTransactionInvoices',
      { invoiceIds: invoiceIds, data: date,  criteria: this.setDataTableParams(criteria)}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  createTaxOnlyInvoices(invoiceIds: number[], criteria: DataTableCriteria, date: any): Promise<string> {
    return this.http.post(this.endPoint + '/createTaxOnlyInvoices',
      { invoiceIds: invoiceIds, data: date,  criteria: this.setDataTableParams(criteria)}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  getInvoiceReport(date: any, selectedReport: string): Promise<string> {
    return this.http.post(this.endPoint + '/invoiceReports',
      {data: date}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  downloadExcel(invoiceId: number): Promise<string> {
    return this.http.post(this.endPoint + '/downloadEmployeesDetails', {'invoiceId': invoiceId}, this.getTokenHeader())
      .toPromise()
      .then(response => response as string)
      .catch(() => null);
  }

  newComment(invoice_id: number, content: string): Promise<boolean> {
    return this.http.post(this.endPoint + '/' + invoice_id + '/comment', { 'content': content }, this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  getInvoiceRemarks(invoice_id: number): Promise<Object> {
    return this.http.get(this.endPoint + '/' + invoice_id + '/getRemarks', this.getTokenHeader())
      .toPromise()
      .then(response => response as Object)
      .catch(() => []);
  }

  createProactiveInvoice(conditions): Promise<any> {
    return this.http.post(this.endPoint + '/createProactiveInvoice', conditions, this.getTokenHeader())
      .toPromise()
      .then(response => response as any)
      .catch(() => false);

  }
  downloadCreditCardInvoicesToExcel(criteria: DataTableCriteria, tax: boolean): Promise<any> {
    const request = this.getTokenHeader();

    if (criteria) {
      request['params'] = this.setDataTableParams(criteria, tax);
    }
    return this.http.get(this.endPoint + '/downloadCreditCardInvoicesToExcel', request).toPromise()
      .then(response => response as string)
      .catch(() => null);
  }
}



