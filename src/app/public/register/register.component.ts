import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserSessionService } from 'app/shared/_services/user-session.service';
import { AppHttpService } from 'app/shared/_services/http/app-http.service';
import { HelpersService} from 'app/shared/_services/helpers.service';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  animations: [  fade ]
})
export class RegisterComponent implements OnInit {

  hasServerError: boolean;
  isSubmitting: boolean;
  constructor( private route: ActivatedRoute,
               private router: Router,
              private appHttp: AppHttpService,
              private userSession: UserSessionService,
              private helpers: HelpersService) {}


  ngOnInit() {
    if (!this.route.snapshot.queryParams.token) {
      return;
    }
  }

  register(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;
      if (form.value.password === form.value.confirmPassword ) {
        this.helpers.setPageSpinner(true);
        this.isSubmitting = true;
        this.appHttp.register(form.value.password, this.route.snapshot.queryParams.token).then(response => {
          if (response.token) {
            this.userSession.login({username: '', token: response['token']});
            this.userSession.setRole(response['role']);
            this.router.navigate(['/platform']);
            this.userSession.setUserModules(response['module']);

          } else if (response.status === 403) {
            this.router.navigate(['/', 'login']);
          } else {
            this.hasServerError = true;
          }

          this.helpers.setPageSpinner(false);
          this.isSubmitting = false;
        });
      } else {
        this.hasServerError = true;
      }

    }
  }

}
