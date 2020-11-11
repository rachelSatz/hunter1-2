import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { HelpersService } from 'app/shared/_services/helpers.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {

  showPageSpinner = false;

  constructor(private helpers: HelpersService,
              public router: Router) {
  }

  ngOnInit(): void {
    this.helpers.pageSpinnerSubject.subscribe(message =>
      this.showPageSpinner = message);

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
