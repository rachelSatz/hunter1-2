import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectUnitService {

  currentProjectGroupId: number;
  currentEmployerRelationID: any;
  unitSubject: Subject<number> = new Subject();
  activeUrl: string;

  setActiveUrl(activeUrl: any): void {
    sessionStorage.setItem('activeUrl', JSON.stringify(activeUrl));
     this.unitSubject.next(activeUrl);
  }

  getActiveUrl(): any {
    return this.getSessionStorage('activeUrl');
  }

  setProjectGroupId(projectGroupId: any): void {
    this.currentProjectGroupId = projectGroupId;
    sessionStorage.setItem('projectGroupId', JSON.stringify(projectGroupId));
    this.unitSubject.next(this.currentProjectGroupId);
  }

  getProjectGroupId(): any {
    return this.getSessionStorage('projectGroupId');
  }

  getEmployerRelation(): any {
    return this.getSessionStorage('employerRelation');
  }

  setEmployerRelation(employerRelation: any): any {
    sessionStorage.setItem('employerRelation', JSON.stringify(employerRelation));
    this.currentEmployerRelationID = employerRelation;
    this.unitSubject.next(employerRelation);
  }


  getSessionStorage(val: string): any {
    if (sessionStorage.getItem(val)) {
      return JSON.parse(sessionStorage.getItem(val));
    }
    return 0;
  }

  setEmployers(employers: any[]): void {
    sessionStorage.setItem('employers', JSON.stringify(employers));
  }

  getEmployers(): any[] {
    return this.getSessionStorage('employers');
  }

  setProjectGroups(projectGroups: any): void {
    sessionStorage.setItem('projectGroups', JSON.stringify(projectGroups));
  }

  getProjectGroups(): any {
    return this.getSessionStorage('ProjectGroups');
  }
}








