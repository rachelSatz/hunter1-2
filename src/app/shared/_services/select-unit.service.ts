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

  unitSubject: Subject<number> = new Subject();

  setOrganization(organizations: any): void {
    sessionStorage.setItem('organizations', JSON.stringify(organizations));
  }

  getOrganizations(): any {
    return this.getSessionStorage('organizations');
  }

  setCompanies(companies: any): void {
    sessionStorage.setItem('companies', JSON.stringify(companies));
  }

  getOrganization(): any {
    return this.getSessionStorage('organizations');
  }

  getCompanies(): any {
    if (sessionStorage.getItem('companies')) {
      return this.getSessionStorage('companies');
    }
    return [];
  }

  setProcessData(processData: any): void {
    sessionStorage.setItem('processData', JSON.stringify(processData));
  }

  getProcessData(): any {
    return this.getSessionStorage('processData');
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


  setReportFilters(reportFilters: any): void {
    sessionStorage.setItem('report', JSON.stringify(reportFilters));
  }

  getReportFilters(): any {
    return this.getSessionStorage('report');
  }

  clearReportFilters(): void {
    sessionStorage.removeItem('report');
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

  getEmployerID(): any {
    return  this.getSessionStorage('employerID');
  }

  setEmployerID(val: number): any {
    sessionStorage.setItem('employerID', val.toString());
  }

  getSessionStorage(val: string): any {
    if (sessionStorage.getItem(val)) {
      return JSON.parse(sessionStorage.getItem(val));
    }
    return 0;
  }

  logout(): void {
    this.changeOrganizationEmployerDepartment(0, 0, 0);
    sessionStorage.removeItem('organizationID');
    sessionStorage.removeItem('employerID');
    sessionStorage.removeItem('departmentID');
    sessionStorage.removeItem('Organizations');
    sessionStorage.removeItem('task');
    sessionStorage.removeItem('agentBarActive');


  }


  changeOrganizationEmployerDepartment(organizationId: number, employerId: number, departmentId: number): void {
    sessionStorage.setItem('organizationID', JSON.stringify(organizationId));
    sessionStorage.setItem('employerID', JSON.stringify(employerId));
    sessionStorage.setItem('departmentID', JSON.stringify(departmentId));

    this.currentEmployerID = employerId;
    this.currentOrganizationID = organizationId;
    this.currentDepartmentID = departmentId;
    this.unitSubject.next(organizationId);
  }

  setEntitySessionStorage(organizationId: number, employerId: number, departmentId: number): void {
    sessionStorage.setItem('organization', JSON.stringify(organizationId));
    sessionStorage.setItem('employer', JSON.stringify(employerId));
    sessionStorage.setItem('department', JSON.stringify(departmentId));
  }

  getEntitySessionStorage(): boolean {
    if (sessionStorage.getItem('organization')) {
      this.changeOrganizationEmployerDepartment(this.getSessionStorage('organization'),
        this.getSessionStorage('employer'),
        this.getSessionStorage('department'));
      return true;
    } else {
      return false;
    }
  }





  changeOrganization(organizationId: number): void {
    sessionStorage.setItem('organizationID', JSON.stringify(organizationId));
    this.currentOrganizationID = organizationId;
    this.unitSubject.next(organizationId);
  }


  getAgentBarActive(): boolean {
    if (sessionStorage.getItem('agentBarActive')) {
      return this.getSessionStorage('agentBarActive');
    } else {
      return true;
    }
  }

  setAgentBarActive(agentBarActive: boolean): void {
    sessionStorage.setItem('agentBarActive', JSON.stringify(agentBarActive));

  }



}








