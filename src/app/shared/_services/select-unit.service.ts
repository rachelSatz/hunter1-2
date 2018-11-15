import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class SelectUnitService {

  currentOrganizationID: number;
  currentEmployerID: number;

  unitSubject: Subject<number> = new Subject();

  changeOrganization(id: number): void {
    this.currentOrganizationID = id;
    this.unitSubject.next(id);
  }

  changeEmployer(id: number): void {
    this.currentEmployerID = id;
    this.unitSubject.next(id);
  }

}








