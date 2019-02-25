import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AppHttpService } from 'app/shared/_services/http/app-http.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { HelpersService} from 'app/shared/_services/helpers.service';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [ fade ]
})
export class LoginComponent {

  hasServerError: boolean;
  isSubmitting: boolean;

  constructor(private router: Router, private appHttp: AppHttpService,
              private userSession: UserSessionService,
              private helpers: HelpersService) {}

  login(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;
      this.helpers.setPageSpinner(true);
      this.isSubmitting = true;


      this.appHttp.login(form.value.username, form.value.password).then(response => {
        if (response.token) {
        this.userSession.login({username: form.value.username, token: response['token']});
        this.userSession.setRole(response['role']);
        this.router.navigate(['/platform']);
        } else {
           this.hasServerError = true;
        }
        this.helpers.setPageSpinner(false);
        this.isSubmitting = false;
      });
    }
  }
}

