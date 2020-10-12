import { Component, OnInit } from '@angular/core';
import {fade} from '../../shared/_animations/animation';
import {ActivatedRoute, Router} from '@angular/router';
import {AppHttpService} from '../../shared/_services/http/app-http.service';
import {UserSessionService} from '../../shared/_services/http/user-session.service';
import {HelpersService} from '../../shared/_services/helpers.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  animations: [  fade ]
})
export class RegisterComponent implements OnInit {

  hasServerError: boolean;
  isSubmitting: boolean;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private appHttp: AppHttpService,
              private userSession: UserSessionService) { }

  ngOnInit() {
    if (!this.route.snapshot.queryParams.token) {
      return;
    }
  }
  register(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;
      if (form.value.password === form.value.confirmPassword) {
        this.isSubmitting = true;
        this.appHttp.register(form.value.password, this.route.snapshot.queryParams.token).then(response => {
          if (response.token) {
             console.log(response);
             this.userSession.login({username: '', token: response['token']});
             this.userSession.setRole(response['role']);
             this.userSession.setUserModules(response['module']);
             if (response['role'] !== 'employer') {
               this.router.navigate(['/platform']);
            }else {
               console.log('I am employer');
            }

          } else if (response.status === 403) {
            this.router.navigate(['/', 'login']);
          } else {
            this.hasServerError = true;
          }
          this.isSubmitting = false;
        });
      } else {
        this.hasServerError = true;
      }

    }
  }

}
