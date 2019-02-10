import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Department } from '../_models/department.model';
import { DepartmentService } from '../_services/http/department.service';

@Injectable()
export class DepartmentsResolve implements Resolve<Department> {

  constructor(private departmentService: DepartmentService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.departmentService.getDepartment(+snapshot.params.id).then(response => response as Department);
  }
}
