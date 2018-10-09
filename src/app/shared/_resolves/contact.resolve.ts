import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { ContactService } from '../_services/http/contact.service';

import { Contact } from '../_models/contact.model';

@Injectable()
export class ContactResolve implements Resolve<Contact> {

  constructor(private contactService: ContactService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.contactService.getContact(+snapshot.params.id).then(response => response as Contact);
  }
}
