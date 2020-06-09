import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { UserSessionService } from 'app/shared/_services/user-session.service';

@Injectable()
export class IsAuthenticatedGuard implements CanActivate {
  constructor(private router: Router, private userSession: UserSessionService) {}

  canActivate(snapshot: ActivatedRouteSnapshot): boolean {
    if (this.userSession.getUser()) {
      return true;
    }
    alert('hjh');
    this.router.navigate(['/']);
    return false;
  }
}
