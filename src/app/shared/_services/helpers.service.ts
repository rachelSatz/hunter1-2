import { Subject } from 'rxjs/Subject';
import { Organization } from '../_models/organization.model';

export class HelpersService {

  pageSpinnerSubject: Subject<boolean> = new Subject();
  lastUrlSubject: Subject<string> = new Subject();

  setPageSpinner(isShown: boolean): void {
    setTimeout(() => this.pageSpinnerSubject.next(isShown), 0);
  }
}

