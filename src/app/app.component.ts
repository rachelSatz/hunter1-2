import {Component, OnInit} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {HelpersService} from './shared/_services/helpers.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {

  y: any;
  x: any;
  showPageSpinner = false;

  constructor(private helpers:HelpersService,
              public router:Router) {
  }

  ngOnInit(): void {
  };


}
