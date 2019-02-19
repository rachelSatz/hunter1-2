import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { TimerService } from '../../../../shared/_services/http/timer';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-emails',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy  {
  seconds: string;
  minutes: string;
  hours: string;
  path: string;
  text: string;

  constructor(public dialog: MatDialog,
              private timerService: TimerService,
              protected route: ActivatedRoute) {
    this.intervals();
  }

  ngOnInit() {
    this.path = (this.route.snapshot.routeConfig.path) ? this.route.snapshot.routeConfig.path : '';
    if (this.path !== '') {
      switch (this.path) {
        case 'phone-call': {
          this.text = 'זמן טיפול בשיחת טלפון';
          this.timerService.reset();
          this.timerService.setPath(1);
          break;
        }
        case 'emails': {
          this.text = 'זמן טיפול במיילים';
          this.timerService.reset();
          break;
        }
        case 'guidance': {
          this.text = 'זמן הדרכה';
          this.timerService.reset();
          break;
        }
        case 'interruption': {
          this.text = 'זמן הפסקה';
          this.timerService.reset();
          break;
        }
      }
    }
  }

  intervals(): void {
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
  ngOnDestroy() {
    // this.timerService.setPath(1);
  }
}
