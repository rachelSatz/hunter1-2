import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
// import {Organization} from '../_models/organization.model';

@Injectable({
  providedIn: 'root'
})
export class SelectUnitService {

  currentOrganizationID: number;
  currentEmployerID: number;
  unitSubject: Subject<number> = new Subject();


  setOrganization(organizations: any): void {
    sessionStorage.setItem('organizations', JSON.stringify(organizations));
    this.currentOrganizationID = organizations;
    //this.unitSubject.next(organizations);
  }

  getOrganization(): any {
    return this.getSessionStorage('organizations');
  }


  getEmployerID(): any {
    return this.getSessionStorage('employerID');
  }

  setEmployerID(employerId: number): any {
    sessionStorage.setItem('employerID', employerId.toString());
    this.currentEmployerID = employerId;
    this.unitSubject.next(employerId)
  }


  getSessionStorage(val: string): any {
    if (sessionStorage.getItem(val)) {
      return JSON.parse(sessionStorage.getItem(val));
    }
    return 0;
  }


  changeOrganizationEmployerDepartment(organizationId: number, employerId: number): void {
    sessionStorage.setItem('organizationID', JSON.stringify(organizationId));
    sessionStorage.setItem('employerID', JSON.stringify(employerId));

    this.currentEmployerID = employerId;
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
}








