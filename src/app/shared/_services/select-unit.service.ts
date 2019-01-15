import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class SelectUnitService {

  currentOrganizationID: number;
  currentEmployerID: number;
  currentDepartmentID: number;

  currentOrganizations: any;
  currentEmployers: any;
  currentDepartments: any;

  unitSubject: Subject<number> = new Subject();
  unitObjSubject: Subject<object> = new Subject();
  // changeOrganization(id: number): void {
  //   this.currentOrganizationID = id;
  //   this.unitSubject.next(id);
  // }
  //
  // changeEmployer(id: number): void {
  //   this.currentEmployerID = id;
  //   this.unitSubject.next(id);
  // }

  changeDepartment(id: number): void {
    this.currentDepartmentID = id;
    this.unitSubject.next(id);
  }

  changeEmployersDepartments( employers: any, departments: any): void {
    this.currentEmployers = employers;
    this.currentDepartments = departments;
    this.unitObjSubject.next(employers);
    this.unitObjSubject.next(departments);
  }


  changeOrganizationEmployerDepartment(organizationId: number, employerId: number, departmentId: number): void {
    this.currentEmployerID = employerId;
    this.currentOrganizationID = organizationId;
    this.currentDepartmentID = departmentId;
    this.unitSubject.next(organizationId);
    this.unitSubject.next(employerId);
    this.unitSubject.next(departmentId);
  }

  changeOrganizationEmployer(organizationId: number, employerId: number): void {
    this.currentEmployerID = employerId;
    this.currentOrganizationID = organizationId;
    this.unitSubject.next(organizationId);
    this.unitSubject.next(employerId);
  }

}








