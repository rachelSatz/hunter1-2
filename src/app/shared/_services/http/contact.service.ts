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

  getContactByEmail(email: string, contactId: number, employerId: number): Promise<Contact> {
    const options = this.getTokenHeader();
    options['params'] = {email: email, employerId: employerId};
    return this.http.get(this.endPoint + '/' + contactId + '/contactByEmail', options)
      .toPromise()
      .then(response => response as Contact)
      .catch(() => null);
  }

  newContact(contact: Contact, employerId: number): Promise<any> {
    contact.employer_id = employerId;
    return this.http.post(this.endPoint, contact, this.getTokenHeader())
    .toPromise()
    .then(response => response)
    .catch(response => response);
  }

  updateContact(contact: Contact): Promise<any> {
    return this.http.put(this.endPoint + '/' + contact.id, contact, this.getTokenHeader())
    .toPromise()
    .then(response => response)
    .catch(response => response);
  }


  getEmployerContacts(objectId: number, employerId: string, contentType: string, type: string): Promise<any[]> {
    return this.http.post(this.endPoint + '/employerContacts', { 'object_id': objectId
      , 'employer_id': employerId, 'content_type': contentType, 'type': type} , this.getTokenHeader())
      .toPromise()
      .then(response => response as any[])
      .catch(() => []);
  }
}
