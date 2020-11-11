import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class  UserSessionService {

  admin = 'admin';
  superUser = 'superUser';
  operator = 'operator';
  feedback = 'feedback';
  modules;
  loginStatus: Subject<boolean> = new Subject;
  role: Subject<string> = new Subject;

  setRole(role: string): void {
    sessionStorage.setItem('role', JSON.stringify(role));
    this.role.next( role);
  }

  setUserModules(module): void {
    sessionStorage.setItem('module', JSON.stringify(module));
  }

  getUserModules(): any {
    if (sessionStorage.getItem('module')) {
      return JSON.parse(sessionStorage.getItem('module'));
    }
    return null;
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
  }

  isPermissions(module): boolean {
    const mod = this.getUserModules();
       this.modules = mod.filter(m => m.name ===  module);
       if (this.modules.length > 0) {
         return false;
       }
       return true;
  }

  getPermissionsType(module): any {
    if (!this.isPermissions(module)) {
      const permission_type = this.modules[0].permission_type;
      if (permission_type === 'all') {
        return true;
      }
      return false;
    }
    return false;
  }

  getToken(): string {
    if (sessionStorage.getItem('user')) {
      return JSON.parse(sessionStorage.getItem('user')).token;
    }
   return null;
  }
}
