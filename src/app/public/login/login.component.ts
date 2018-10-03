import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AppHttpService } from 'app/shared/_services/http/app-http.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  constructor(private router: Router, private appHttp: AppHttpService,
              private userSession: UserSessionService) {}

  login(form: NgForm): void {
    if (form.valid) {
      this.userSession.login({ username: 'f'} );
      this.router.navigate(['/platform']);
      //this.appHttp.login(form.value.username, form.value.password).then(response => response);
    }
  }
}
