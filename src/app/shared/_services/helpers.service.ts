import { Subject } from 'rxjs/Subject';

export class HelpersService {

  pageSpinnerSubject: Subject<boolean> = new Subject();
  lastUrlSubject: Subject<string> = new Subject();

  setPageSpinner(isShown: boolean): void {
    setTimeout(() => this.pageSpinnerSubject.next(isShown), 0);
  }

}

