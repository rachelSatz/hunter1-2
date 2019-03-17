import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import { Contact } from 'app/shared/_models/contact.model';
import {SelectUnitService} from '../select-unit.service';

@Injectable()
export class  ContactService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/contacts';

  constructor(userSession: UserSessionService, private http: HttpClient, private selectUnit: SelectUnitService) {
    super(userSession);
  }

  getContacts(organizationId: number, employerId: number, location: string): Promise<Contact[]> {
    const options = this.getTokenHeader();

    if (employerId) {
      options['params'] = {employerId: employerId, location: location};
    }else {
      options['params'] = {organizationId : organizationId, location: location};
    }

    return this.http.get(this.endPoint, options)
    .toPromise()
    .then(response => response as Contact[])
    .catch(() => []);
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
