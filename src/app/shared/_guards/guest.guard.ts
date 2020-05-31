import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { UserSessionService } from 'app/shared/_services/user-session.service';

@Injectable()
export class GuestGuard implements CanActivate {
  constructor(private router: Router, private userSession: UserSessionService) {}

  canActivate(snapshot: ActivatedRouteSnapshot): boolean {
    // return !this.userSession.getUser();
    return true;
  }
}
