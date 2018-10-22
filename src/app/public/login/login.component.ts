import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { AppHttpService } from 'app/shared/_services/http/app-http.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { HelpersService} from 'app/shared/_services/helpers.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        opacity: '0'
      })),
      state('active', style({
        display: 'block',
        opacity: '1'
      })),
      transition('active => inactive', animate('300ms ease-in')),
      transition('inactive => active', animate('300ms ease-in'))
    ])
  ]
})
export class LoginComponent {

  hasServerError: boolean;
  isSubmitting: boolean;

  constructor(private router: Router, private appHttp: AppHttpService,
              private userSession: UserSessionService, private helpers: HelpersService) {}

  login(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;
      // this.helpers.setPageSpinner(true);
      // this.isSubmitting = true;

      this.appHttp.login(form.value.username, form.value.password).then(response => {
      //   if (response) {
          this.userSession.login({ username: form.value.username, token: '4444' });
          this.router.navigate(['/platform']);
        // } else {
        //   this.hasServerError = true;
        // }
        //
        // this.helpers.setPageSpinner(false);
        // this.isSubmitting = false;
      // });
      // this.appHttp.login(form.value.username, form.value.password).then(response => {
        // if (response) {
        //  this.userSession.login({ username: form.value.username, token: response.token });
        //   this.router.navigate(['/platform']);
        // } else {
        //   this.hasServerError = true;
        // }
        // this.userSession.login({ username: 'ruth', token: '1234' });
        // sessionStorage.setItem('user', JSON.stringify('ruth'));
        // sessionStorage.setItem('token', JSON.stringify('1234'));

        // this.router.navigate(['/platform']);

        this.helpers.setPageSpinner(false);
        this.isSubmitting = false;
      });
    }
  }
}
