import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { UserService } from '../_services/http/user.service';
import { User } from '../_models/user.model';

@Injectable()
export class UsersResolve implements Resolve<User> {

  constructor(private userService: UserService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.userService.getUser(+snapshot.params.id).then(response => response as User);
  }
}
