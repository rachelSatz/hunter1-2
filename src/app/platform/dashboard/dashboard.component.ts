import { Component, OnInit } from '@angular/core';

import { UserSessionService } from 'app/shared/_services/user-session.service';
import { User } from 'app/shared/_models/user.model';
import {ActivatedRoute, Router} from '@angular/router';
import {TimerService} from '../../shared/_services/http/timer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: User;
  seconds: string;
  minutes: string;
  hours: string;
  show = false;

  readonly chartData = {
    options: {
      legend: {
        position: 'bottom',
      },
      responsive: true
    },
    values: [
      { label: 'לא נפרע', data: [150] }, { label: 'נפרע', data: [220] }, { label: 'נפרע', data: [330] }
    ]};

  stats = [
    { 'title': 'סה"כ עובדים', 'image': 'group', value: 0 }, { 'title': 'פניות פתוחות', 'image': 'text_bubbles', value: 0 },
    { 'title': 'כספים ששולמו', 'image': 'coins', value: 0 }, { 'title': 'קבצים ששודרו', 'image': 'folder', value: 0 }
  ];

  constructor(private userSession: UserSessionService, private route: ActivatedRoute,
              public timerService: TimerService, private router: Router) { }

  ngOnInit() {
    this.user = this.userSession.getUser();
    this.intervals();

  }

  intervals(): void {
    if (this.timerService.second.value > 0) {
      this.show = true;
      this.timerService.getSecondsObservable().subscribe(val => {
        if (val < 10) {
          this.seconds = '0' + val.toString();
        } else {
          this.seconds = val.toString();
        }
      });

      this.timerService.getMinutesObservable().subscribe(val => {
        if (val < 10) {
          this.minutes = '0' + val.toString();
        } else {
          this.minutes = val.toString();
        }
      });
      this.timerService.getHoursObservable().subscribe(val => {
        if (val < 10) {
          this.hours = '0' + val.toString();
        } else {
          this.hours = val.toString();
        }
      });
    }
  }

  stopTimer(): void {
    this.router.navigate(['platform', 'operator', 'work-queue']);
  }
}
