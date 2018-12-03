import { Subject } from 'rxjs/Subject';
import { Organization } from '../_models/organization.model';

export class HelpersService {

  pageSpinnerSubject: Subject<boolean> = new Subject();
  lastUrlSubject: Subject<string> = new Subject();
  organizations: Organization[];

  setPageSpinner(isShown: boolean): void {
    setTimeout(() => this.pageSpinnerSubject.next(isShown), 0);
  }

  // setOrganizations(organizations: Organization[]): void {
   // this.organizations = organizations;
   // this.organizations.next(organizations);
  // }
}

