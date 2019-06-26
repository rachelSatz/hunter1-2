import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { ContactService } from '../_services/http/contact.service';

import { Contact } from '../_models/contact.model';
import {DepartmentSerialNumber} from '../_models/employer.model';
import {SelectUnitService} from '../_services/select-unit.service';
import {DepartmentService} from '../_services/http/department.service';

@Injectable()
export class ContactResolve implements Resolve<Contact> {

  constructor(private contactService: ContactService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.contactService.getContact(+snapshot.params.id).then(response => response as Contact);
  }
}

@Injectable()
export class ManufacturerNumberResolve implements Resolve<DepartmentSerialNumber> {

  constructor(private selectUnit: SelectUnitService,
              private departmentService: DepartmentService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.departmentService.getSingleSNInEmployer(+snapshot.params.id, this.selectUnit.currentEmployerID)
      .then(response => response as DepartmentSerialNumber);
  }
}
