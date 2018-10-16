import { Component, OnInit } from '@angular/core';
import { NavigationStart, NavigationEnd, Router } from '@angular/router';

import { UserSessionService } from 'app/shared/_services/user-session.service';
import { HelpersService } from 'app/shared/_services/helpers.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  showPageSpinner = false;

  constructor(private router: Router, private userSession: UserSessionService,
              private helpers: HelpersService) {}

  ngOnInit() {
    this.helpers.pageSpinnerSubject.subscribe(message => this.showPageSpinner = message);

    this.router.events.forEach(event => {
      if (event instanceof NavigationStart) {
        this.showPageSpinner = true;
      }

      if (event instanceof NavigationEnd) {
        this.showPageSpinner = false;
        this.helpers.lastUrlSubject.next(event.url);
      }
    });
  }
}
