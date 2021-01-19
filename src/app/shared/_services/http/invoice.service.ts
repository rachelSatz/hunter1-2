import { Injectable } from '@angular/core';
import { UserSessionService } from './user-session.service';
import { HttpClient } from '@angular/common/http';
import { BaseHttpService } from './base-http.service';
import { DataTableCriteria } from '../../data-table/classes/data-table-criteria';
import { DataTableResponse } from '../../data-table/classes/data-table-response';
import { InvoiceDetailsRemarks, ManualInvoice } from '../../_models/invoice.model';
import { SelectUnitService } from '../select-unit.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/invoices';

  constructor(userSession: UserSessionService, private http: HttpClient, private selectunit: SelectUnitService) {
    super(userSession);
  }

  getProjectGroupId(): void {
    return this.selectunit.getProjectGroupId();
  }

  getInvoices(criteria?: DataTableCriteria, noLimit?: boolean): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      if (criteria.filters['status']) {
        criteria.filters['status'] = criteria.filters['status'].toString();
      }
      if (criteria.filters['project_name']) {
        criteria.filters['project_name'] = criteria.filters['project_name'].toString();
      }
      request['params'] = this.setDataTableParams(criteria);
    }
    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }
    request['params']['project_group_id'] = this.getProjectGroupId();
    return this.http.get(this.endPoint, request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getNewEmployersIncomes(criteria?: DataTableCriteria, noLimit?: boolean): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
      request['params']['project_group_id'] = this.getProjectGroupId();
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
      request['params']['project_group_id'] = this.getProjectGroupId();
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
      request['params']['project_group_id'] = this.getProjectGroupId();
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
      request['params']['project_group_id'] = this.getProjectGroupId();
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
      request['params']['project_group_id'] = this.getProjectGroupId();
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
      request['params']['project_group_id'] = this.getProjectGroupId();
    }
    if (noLimit) {
      request['params'] = {no_limit : noLimit};
    }
    return this.http.get(this.endPoint + '/getNeedToChargeEmployersTable', request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }


  getEmployerInvoices(criteria?: DataTableCriteria, employerRelationId?: number, noLimit?: boolean): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
      request['params']['employer_relation'] = employerRelationId;
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
    request['params']['project_group_id'] = this.getProjectGroupId();
    return this.http.get(this.endPoint + '/downloadInvoicesToExcel', request)
      .toPromise()
      .then(response => response as string)
      .catch(() => null);
  }

  createManualInvoice(manualInvoice: ManualInvoice, updateEmployees: boolean): Promise<string> {
    return this.http.post(this.endPoint + '/createManualInvoice',
      { 'manual_invoice': manualInvoice, 'update_employees': updateEmployees },  this.getTokenHeader())
      .toPromise()
      .then(response => response as string)
      .catch(() => null);
  }

  createTaxInvoices(invoiceIds: number[], criteria: DataTableCriteria, date: any): Promise<string> {
    return this.http.post(this.endPoint + '/createTaxInvoices',
      { invoiceIds: invoiceIds, data: date,  criteria: this.setDataTableParams(criteria)}, this.getTokenHeader())
      .toPromise()
      .then(response => response as string)
      .catch(() => null);
  }

  createTransactionInvoices(invoiceIds: number[], criteria: DataTableCriteria, date: any): Promise<string> {
    return this.http.post(this.endPoint + '/createTransactionInvoices',
      { invoiceIds: invoiceIds, data: date,  criteria: this.setDataTableParams(criteria)}, this.getTokenHeader())
      .toPromise()
      .then(response => response as string)
      .catch(() => null);
  }

  createTaxOnlyInvoices(invoiceIds: number[], criteria: DataTableCriteria, date: any): Promise<string> {
    return this.http.post(this.endPoint + '/createTaxOnlyInvoices',
      { invoiceIds: invoiceIds, data: date,  criteria: this.setDataTableParams(criteria)}, this.getTokenHeader())
      .toPromise()
      .then(response => response as string)
      .catch(() => null);
  }

  getInvoiceReport(date: any, selectedReport: string): Promise<string> {
    const request = this.getTokenHeader();
    request['params'] = {};
    request['params']['project_group_id'] = this.getProjectGroupId();
    return this.http.post(this.endPoint + '/invoiceReports',
      {data: date}, request)
      .toPromise()
      .then(response => response as string)
      .catch(() => null);
  }

  downloadExcel(invoiceId: number): Promise<string> {
    return this.http.post(this.endPoint + '/downloadEmployeesDetails',
      {'invoiceId': invoiceId, 'project_group_id': this.getProjectGroupId()}, this.getTokenHeader())
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

  getInvoiceRemarks(invoice_id: number): Promise<InvoiceDetailsRemarks> {
    return this.http.get(this.endPoint + '/' + invoice_id + '/getRemarks', this.getTokenHeader())
      .toPromise()
      .then(response => response as InvoiceDetailsRemarks)
      .catch(() => null);
  }

  createProactiveInvoice(conditions): Promise<any> {
    const request = this.getTokenHeader();
    request['params'] = {};
    request['params']['project_group_id'] = this.getProjectGroupId();
    return this.http.post(this.endPoint + '/createProactiveInvoice', conditions, request)
      .toPromise()
      .then(response => response as any)
      .catch(() => false);

  }
  deleteInvoices(invoicesIds: any[], criteria: DataTableCriteria, updateEmployees: boolean): Promise<any> {
    return this.http.post(this.endPoint + '/deleteInvoices',
      {
        'invoicesIds': invoicesIds,
        criteria: this.setDataTableParams(criteria),
        updateEmployees: updateEmployees
      }, this.getTokenHeader())
      .toPromise()
      .then(response => response as string);
  }

  createMasav(invoiceIds: number[], criteria: DataTableCriteria): Promise<any> {
    const request =  this.getTokenHeader();
    return this.http.post(this.endPoint + '/createMasav',
      {invoiceIds: invoiceIds, criteria: this.setDataTableParams(criteria)}, request)
      .toPromise()
      .then(response => response);
  }

  downloadCreditCardInvoicesToExcel(criteria: DataTableCriteria, tax: boolean): Promise<any> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria, tax);
    }
    request['params']['project_group_id'] = this.getProjectGroupId();
    return this.http.get(this.endPoint + '/downloadCreditCardInvoicesToExcel', request).toPromise()
      .then(response => response as string)
      .catch(() => null);
  }
}



