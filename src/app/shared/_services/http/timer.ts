import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import { timeInterval } from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {SelectUnitService} from '../select-unit.service';

@Injectable()
export class TimerService {
  second = new BehaviorSubject<number>(0);
  minute = new BehaviorSubject<number>(0);
  hour = new BehaviorSubject<number>(0);

  constructor() {
      this.setIntervals();
  }

  public getSecondsObservable() {
    return this.second.asObservable();
  }
  public getMinutesObservable() {
    return this.minute.asObservable();
  }
  public getHoursObservable() {
    return this.hour.asObservable();
  }

  reset() {
    this.second.next(0);
    this.minute.next(0);
    this.hour.next(0);
  }

  public setIntervals() {
     setInterval(() => {
      const newVal = this.second.getValue() + 1;
      this.second.next(newVal);
    }, 1000);
    setInterval(() => {
      this.second.next(0);
      const minuteVal = this.minute.getValue() + 1;
      this.minute.next(minuteVal);
    }, 60000);
    setInterval(() => {
      this.second.next(0);
      this.minute.next(0);
      const hourVal = this.minute.getValue() + 1;
      this.hour.next(hourVal);
    }, 3600000);
  }

  // setPath(id: number): void {
  //   this.id.next(1);
  //   this.id.next(id);
  // }

}
