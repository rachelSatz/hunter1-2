import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class SelectUnitService {

  currentOrganizationID: number;
  currentEmployerID: number;
  unitSubject: Subject<number> = new Subject();
  activeUrl: string;

  setActiveUrl(activeUrl: any): void {
    sessionStorage.setItem('activeUrl', JSON.stringify(activeUrl));
     this.unitSubject.next(activeUrl);
  }

  getActiveUrl(): any {
    return this.getSessionStorage('activeUrl');
  }

  setOrganization(organizations: any): void {
    sessionStorage.setItem('organizations', JSON.stringify(organizations));
    this.currentOrganizationID = organizations;
    this.unitSubject.next(organizations);
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
    this.unitSubject.next(employerId);
  }


  getSessionStorage(val: string): any {
    if (sessionStorage.getItem(val)) {
      return JSON.parse(sessionStorage.getItem(val));
    }
    return 0;
  }


}








