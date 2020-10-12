import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { EmployerService } from '../_services/http/employer.service';
import { Employer } from '../_models/employer.model';


@Injectable()
export class EmployersResolve implements Resolve<Employer> {

  constructor(private employerService: EmployerService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.employerService.getEmployer(+snapshot.params.id).then(response => response as Employer);
  }
}
