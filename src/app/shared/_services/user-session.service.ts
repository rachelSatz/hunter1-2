import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class UserSessionService {

  loginStatus: Subject<boolean> = new Subject;

  isLoggedIn() {
    return !!sessionStorage.getItem('user');
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

  hasResourcePermission(resource: string, type: 'view' | 'actions'): any {
    const user = this.getUser();
    if (!user) {
      return false;
    }

    if (['admin', 'organization_admin', 'organization'].indexOf(user.role) !== -1) {
      return true;
    }

    return user.resources.some(userResource => {
      if (userResource.resource === resource && userResource.permissionType === type) {
        return true;
      }
    });
  }

  getToken(): string {
    if (sessionStorage.getItem('user')) {
      return JSON.parse(sessionStorage.getItem('user')).token;
    }

    return null;
  }

  setUser(user: Object): void {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  resetAdminUser(): void {
    sessionStorage.setItem('user', sessionStorage.getItem('adminUser'));
    sessionStorage.removeItem('adminUser');
  }

  hasAdminUser(): boolean {
    return !!sessionStorage.getItem('adminUser');
  }

  storeAdminUser(): void {
    sessionStorage.setItem('adminUser', sessionStorage.getItem('user'));
  }

  getAdminToken(): string {
    if (this.hasAdminUser()) {
      return JSON.parse(sessionStorage.getItem('adminUser')).token;
    }

    return null;
  }
}
