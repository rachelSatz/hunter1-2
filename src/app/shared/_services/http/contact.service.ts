import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import { Contact } from 'app/shared/_models/contact.model';
import {SelectUnitService} from '../select-unit.service';
import {DataTableCriteria} from '../../data-table/classes/data-table-criteria';
import {DataTableResponse} from '../../data-table/classes/data-table-response';

@Injectable()
export class  ContactService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/contacts';

  constructor(userSession: UserSessionService, private http: HttpClient, private selectUnit: SelectUnitService) {
    super(userSession);
  }

  getContacts(criteria?: DataTableCriteria): Promise<DataTableResponse> {
    const request = this.getTokenHeader();

    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }

    return this.http.get(this.endPoint, request)
    .toPromise()
    .then(response => response as DataTableResponse)
    .catch(() => null);
  }

  getContact(contactId: number): Promise<Contact> {
    return this.http.get(this.endPoint + '/' + contactId, this.getTokenHeader())
    .toPromise()
    .then(response => response as Contact)
    .catch(() => null);
  }

  getContactByEmail(email: string, contactId: number): Promise<Contact> {
    const options = this.getTokenHeader();
    options['params'] = {email: email};
    return this.http.get(this.endPoint + '/' + contactId + '/ContactByEmail', options)
      .toPromise()
      .then(response => response as Contact)
      .catch(() => null);
  }

  newContact(contact: Contact, employerId: number): Promise<boolean> {
    contact.employer_id = employerId;
    return this.http.post(this.endPoint, contact, this.getTokenHeader())
    .toPromise()
    .then(() => true)
    .catch(() => false);
  }

  updateContact(contact: Contact): Promise<boolean> {
    return this.http.put(this.endPoint + '/' + contact.id, contact, this.getTokenHeader())
    .toPromise()
    .then(() => true)
    .catch(() => false);
  }


  getEmployerContacts(companyId: string, employerId: string): Promise<any[]> {
    return this.http.post(this.endPoint + '/employerContacts', { 'company_id': companyId
      , 'employer_id': employerId} , this.getTokenHeader())
      .toPromise()
      .then(response => response as any[])
      .catch(() => []);
  }
}
