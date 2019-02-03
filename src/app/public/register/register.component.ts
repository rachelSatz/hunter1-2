import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AppHttpService} from '../../shared/_services/http/app-http.service';
import {UserSessionService} from '../../shared/_services/user-session.service';
import {HelpersService} from '../../shared/_services/helpers.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
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
      this.helpers.setPageSpinner(true);
      this.isSubmitting = true;


      this.appHttp.register(form.value.password, this.route.snapshot.queryParams.token).then(response => {
        if (response.token) {
          this.userSession.login({username: '', token: response['token']});
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
