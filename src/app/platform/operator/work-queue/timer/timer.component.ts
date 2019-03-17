import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { TimerService } from 'app/shared/_services/http/timer';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {OperatorTasksService} from 'app/shared/_services/http/operator-tasks';
import {Time} from '@angular/common';
import {Timestamp} from 'rxjs';
import {SelectUnitService} from 'app/shared/_services/select-unit.service';
import {TaskTimer, TaskTimerLabels} from 'app/shared/_models/timer.model';

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
  task_timer_id: any;
  id: number;
  taskObj = new TaskTimer;

  constructor(public dialog: MatDialog,
              private timerService: TimerService,
              protected route: ActivatedRoute,
              private operatorTasks: OperatorTasksService,
              public selectUnit: SelectUnitService,
              private router: Router) {
    this.intervals();
  }

  ngOnInit() {
    this.path = (this.route.snapshot.routeConfig.path) ? this.route.snapshot.routeConfig.path : '';
    if (this.path !== '') {
      this.taskObj.path = this.path;
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
    // this.timerService.setIntervals();
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
          this.taskObj.id = response;
          this.selectUnit.setTaskTimer(this.taskObj);
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
    // this.router.events.subscribe(a =>
    // if (a instanceof NavigationStart) {
    //   a.url
    // });
    // if (Object.values(TaskTimerLabels).some(a => a === url)) {
    //   const time = this.hours + ':' + this.minutes + ':' + this.seconds;
    //   this.updateTaskTimer(time);
    // }
  }
}
