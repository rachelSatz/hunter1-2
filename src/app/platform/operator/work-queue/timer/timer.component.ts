import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { TimerService } from '../../../../shared/_services/http/timer';
import { ActivatedRoute } from '@angular/router';
import {OperatorTasksService} from '../../../../shared/_services/http/operator-tasks';
import {Time} from '@angular/common';
import {Timestamp} from 'rxjs';

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
  task_timer_id: number;
  id: number;

  constructor(public dialog: MatDialog,
              private timerService: TimerService,
              protected route: ActivatedRoute,
              private operatorTasks: OperatorTasksService) {
    this.intervals();
  }

  ngOnInit() {

    this.path = (this.route.snapshot.routeConfig.path) ? this.route.snapshot.routeConfig.path : '';
    if (this.path !== '') {
      switch (this.path) {
        case 'phone-call': {
          this.text = 'זמן טיפול בשיחת טלפון';
          this.timerService.reset();
          this.newTaskTimer('phone_call');
          // this.timerService.setPath(2);
          break;
        }
        case 'emails': {
          this.text = 'זמן טיפול במיילים';
          this.timerService.reset();
          this.newTaskTimer('emails');
          break;
        }
        case 'guidance': {
          this.text = 'זמן הדרכה';
          this.timerService.reset();
          this.newTaskTimer('guidance');
          break;
        }
        case 'interruption': {
          this.text = 'זמן הפסקה';
          this.timerService.reset();
          this.newTaskTimer('interruption');
          break;
        }
      }
    }
  }

  intervals(): void {
<<<<<<< HEAD
    this.timerService.setIntervals();
=======
    // this.timerService.setIntervals();
>>>>>>> 43227594e5864d4b2d2bc0c7f7f1c0c837c3f6c8
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
  newTaskTimer(taskType: string): void {
    this.operatorTasks.newTaskTimer(taskType).then(
      response => {
        if (response > 0 ) {
          this.task_timer_id = response;
        }
      });
  }
  updateTaskTimer(duration: string): void {
    if (this.task_timer_id > 0) {
      this.operatorTasks.updateTaskTimer(this.task_timer_id, duration).then(
        response => response);
    }
  }

  ngOnDestroy() {
    const time = this.hours + ':' + this.minutes + ':' + this.seconds;
    // this.timerService.setPath(1);
    this.updateTaskTimer(time);
  }
}
