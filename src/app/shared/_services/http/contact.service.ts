import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Contact } from 'app/shared/_models/contact.model';

@Injectable()
export class ContactService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/contacts';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getContacts(searchCriteria?: Object): Promise<Contact[]> {
    const options = this.getTokenHeader();

    if (searchCriteria) {
      options['params'] = searchCriteria;
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

  newContact(contact: Contact): Promise<boolean> {
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
}
