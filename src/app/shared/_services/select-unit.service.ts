import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {Organization} from '../_models/organization.model';

@Injectable({
  providedIn: 'root'
})
export class SelectUnitService {

  currentOrganizationID: number;
  currentEmployerID: number;
  currentDepartmentID: number;

   // currentEmployers: any;
  // currentDepartments: any;
  // companies: any;
  unitSubject: Subject<number> = new Subject();
  unitObjSubject: Subject<object> = new Subject();

  setOrganization(organizations: any): void {
    sessionStorage.setItem('organizations', JSON.stringify(organizations));
  }

  setCompanies(companies: any): void {
    sessionStorage.setItem('companies', JSON.stringify(companies));
  }

  getOrganization(): any {
    return  this.getSessionStorage('organizations')['items'];
  }

  getCompanies(): any {
    if (sessionStorage.getItem('companies')) {
      return this.getSessionStorage('companies');
    }
    return [];
  }

  setTaskTimer(task: any): void {
    sessionStorage.setItem('task', JSON.stringify(task));
  }

  getTaskTimer(): any {
    return this.getSessionStorage('task');
  }

  clearTaskTimer(): void {
    sessionStorage.removeItem('task');
  }

  changeDepartment(id: number): void {
    sessionStorage.setItem('departmentID', JSON.stringify(id));
    this.currentDepartmentID = id;
    this.unitSubject.next(id);
  }

  getEntityStorage(): any {
    if (sessionStorage.getItem('organizationID')) {
      this.changeOrganizationEmployerDepartment(
        this.getSessionStorage('organizationID'),
        this.getSessionStorage('employerID'),
        this.getSessionStorage('departmentID'));
      return 0;
    }

    return null;
  }

  getSessionStorage(val: string): any {
    if (sessionStorage.getItem(val)) {
      return JSON.parse(sessionStorage.getItem(val));
    }
    return 0;
  }


  // changeEmployersDepartments( employers: any, departments: any): void {
  //   // this.currentEmployers = employers;
  //   // this.currentDepartments = departments;
  //   this.unitObjSubject.next(employers);
  //   this.unitObjSubject.next(departments);
  // }

  logout(): void {
    this.changeOrganizationEmployerDepartment(0,0,0);
    sessionStorage.removeItem('organizationID');
    sessionStorage.removeItem('employerID');
    sessionStorage.removeItem('departmentID');
    sessionStorage.removeItem('Organizations');
    sessionStorage.removeItem('task');

  }


  changeOrganizationEmployerDepartment(organizationId: number, employerId: number, departmentId: number): void {
    sessionStorage.setItem('organizationID', JSON.stringify(organizationId));
    sessionStorage.setItem('employerID', JSON.stringify(employerId));
    sessionStorage.setItem('departmentID', JSON.stringify(departmentId));

    this.currentEmployerID = employerId;
    this.currentOrganizationID = organizationId;
    this.currentDepartmentID = departmentId;
    this.unitSubject.next(organizationId);
    this.unitSubject.next(employerId);
    this.unitSubject.next(departmentId);
  }

  // changeOrganizationEmployer(organizationId: number, employerId: number): void {
  //   this.currentEmployerID = employerId;
  //   this.currentOrganizationID = organizationId;
  //   this.unitSubject.next(organizationId);
  //   this.unitSubject.next(employerId);
  // }

}








