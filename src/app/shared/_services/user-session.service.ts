import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserSessionService {

	isLoggedInSubject: Subject<boolean> = new Subject;

  login(user: Object): void {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.isLoggedInSubject.next(true);
  }

	logout(): void {
		sessionStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
  }

  getUser(): Object {
    if (sessionStorage.getItem('user')) {
      return JSON.parse(sessionStorage.getItem('user'));
    }

    return null;
  }

  getToken(): string {
    if (sessionStorage.getItem('user')) {
      return JSON.parse(sessionStorage.getItem('user')).token;
    }

    return null;
  }
}
