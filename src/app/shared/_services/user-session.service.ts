import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class UserSessionService {

  // roleName: string;

  loginStatus: Subject<boolean> = new Subject;
  role: Subject<string> = new Subject;

  isLoggedIn() {
    return !!sessionStorage.getItem('user');
  }

  setRole(role: string): void {
    sessionStorage.setItem('role', JSON.stringify(role));
    // this.roleName = role
    this.role.next( role);
  }

  getRole(): any {
    if (sessionStorage.getItem('role')) {
      return JSON.parse(sessionStorage.getItem('role'));
    }
    return null;
  }

  login(user?: Object): void {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.loginStatus.next(true);
  }

  logout(): void {
    sessionStorage.removeItem('user');
    this.loginStatus.next(false);
  }

  getUser(): any {
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
