import { Component, OnInit } from '@angular/core';
import { fade } from '../../shared/_animations/animation';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSessionService } from '../../shared/_services/http/user-session.service';
import { AppHttpService } from '../../shared/_services/http/app-http.service';
import { HelpersService } from '../../shared/_services/helpers.service';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls:['./login.component.css'],
  styles: ['.underline { text-decoration: underline !important; } .blue-color { color: #E82D5C !important;} .center{width: 30%; margin: auto; padding-top: 100px;} .btn{background-color: #E82D5C !important;}'],
  animations: [fade],
})
export class LoginComponent implements OnInit {

  hasServerError: boolean;
  isSubmitting: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userSession: UserSessionService,
              private appHttp: AppHttpService,
              private helpers: HelpersService,
              private dialog: MatDialog) {}

  ngOnInit() {
  }

 //  login(form: NgForm): void {
 //    if (form.valid) {
 //      this.hasServerError = false;
 //      this.helpers.setPageSpinner(true);
 //      this.isSubmitting = true;
 // if(form.value.username=='admin' && form.value.password=='Ss123456')
 // {
 //   this.router.navigate(['/platform']);
 // }
 // else{
 //   this.hasServerError=true
 //   this.isSubmitting = false;
 // }
 //
 //    }
 //  }
  private current_user: any;

  login(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;
      this.helpers.setPageSpinner(true);
      this.isSubmitting = true;
      this.appHttp.login(form.value.username, form.value.password).then(response => {
        if (response.token) {
          this.userSession.login({username: form.value.username, token: response['token']});
          this.userSession.setRole(response['role']);
          this.userSession.setUserModules(response['module']);
          if (response['role'] !== 'employer') {
            this.router.navigate(['/platform']);
          } else {
            console.log('I am employer');
          }
        } else {
          this.hasServerError = true;
        }
        this.isSubmitting = false;
      });
    }
  }
}
