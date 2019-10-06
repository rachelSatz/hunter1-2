import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { EmployerService } from '../_services/http/employer.service';
import { Employer } from '../_models/employer.model';
import { EmployerProductBankAccount } from '../_models/employer-product-bank-account';

@Injectable()
export class EmployersResolve implements Resolve<Employer> {

  constructor(private employerService: EmployerService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.employerService.getEmployer(+snapshot.params.id).then(response => response as Employer);
  }
}

@Injectable()
export class EmployerBankAccountResolve implements Resolve<EmployerProductBankAccount> {

  constructor(private employerService: EmployerService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.employerService.getEmployerBankAccount(+snapshot.params.id)
      .then(response => response as EmployerProductBankAccount);
  }
}

@Injectable()
export class CreatingEmployersResolve implements Resolve<any> {

  constructor(private employerService: EmployerService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.employerService.getEmployerDetailsOnProcess(+snapshot.params.id).then(response => response as any);
  }
}
