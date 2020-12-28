import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectUnitService {

  currentProjectGroupId: number;
  currentEmployerID: any;
  currentOrganizationID: number;
  unitSubject: Subject<number> = new Subject();
  activeUrl: string;

  setActiveUrl(activeUrl: any): void {
    sessionStorage.setItem('activeUrl', JSON.stringify(activeUrl));
     this.unitSubject.next(activeUrl);
  }

  getActiveUrl(): any {
    return this.getSessionStorage('activeUrl');
  }

  setActiveEmployerUrl(activeEmployerUrl: any): void {
    sessionStorage.setItem('activeEmployerUrl', JSON.stringify(activeEmployerUrl));
    // this.unitSubject.next(activeEmployerUrl);
  }

  getActiveEmployerUrl(): any {
    return this.getSessionStorage('activeEmployerUrl');
  }

  setProjectGroupId(projectGroupId: any): void {
    console.log(projectGroupId);
    this.currentProjectGroupId = projectGroupId;
    sessionStorage.setItem('projectGroupId', JSON.stringify(projectGroupId));
    this.unitSubject.next(this.currentProjectGroupId);
  }

  getProjectGroupIdObserve(): Observable<any> {
    return this.unitSubject.asObservable();
  }

  getProjectGroupId(): any {
    return this.getSessionStorage('projectGroupId');
  }

  getEmployerID(): any {
    return this.getSessionStorage('employerID');
  }

  setEmployerID(employerId: any): any {
    sessionStorage.setItem('employerID', JSON.stringify(employerId));
    this.currentEmployerID = employerId;
    this.unitSubject.next(employerId);
  }

  getOrganizationID(): any {
    return this.getSessionStorage('organizationID');
  }

  setOrganizationID(organizationID: number): any {
    sessionStorage.setItem('organizationID', organizationID.toString());
    this.currentOrganizationID = organizationID;
    this.unitSubject.next(organizationID);
  }
  getSessionStorage(val: string): any {
    if (sessionStorage.getItem(val)) {
      return JSON.parse(sessionStorage.getItem(val));
    }
    return 0;
  }
  setEmployers(employers: any): void {
    sessionStorage.setItem('employers', JSON.stringify(employers));
  }
  getEmployers(): any {
    return this.getSessionStorage('employers');
  }

}








