import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import { Contact } from 'app/shared/_models/contact.model';

@Injectable()
export class  ContactService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/contacts';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getContacts(organizationId: number, employerId: number): Promise<Contact[]> {
    const options = this.getTokenHeader();

    if (employerId) {
      options['params'] = {employerId: employerId};
    }else {
      options['params'] = {organizationId : organizationId};
    }

    return this.http.get(this.endPoint, options)
    .toPromise()
    .then(response => response as Contact[])
    .catch(() => []);
  }

  getContact(contactID: number): Promise<Contact> {
    return this.http.get(this.endPoint + '/' + contactID, this.getTokenHeader())
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

  updateContact(contact: Contact, contactID: number): Promise<boolean> {
    return this.http.put(this.endPoint + '/' + contactID, contact, this.getTokenHeader())
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
