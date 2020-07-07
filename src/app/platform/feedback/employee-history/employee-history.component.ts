import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-employee-history',
  templateUrl: './employee-history.component.html',
  styleUrls: ['./employee-history.component.css', '../../process/process-loading/process-loading.component.css']
})
export class EmployeeHistoryComponent implements OnInit {

  activeUrl = 'employees';
  name: string;
  id: string;


  headers = [
    {label: 'היסטורית היזונים',    url: 'employees'  },
    {label: 'היסטורית הערות',   url: 'comments' },
  ];


  constructor(private router: Router,
              public route: ActivatedRoute,
              private _location: Location) {
  }

  ngOnInit() {
    this.name = this.route.snapshot.paramMap.get('name');
    this.id = this.route.snapshot.paramMap.get('personal_id');
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.setActiveUrl(event.url);
      }
    });
  }

  setActiveUrl(url: string): void {
    this.activeUrl = url.indexOf('comments') === -1 ? 'employees' : 'comments';
  }

  returnToFeed(): void {
    this._location.back();
  }




}
