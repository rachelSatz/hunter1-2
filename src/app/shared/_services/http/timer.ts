import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { timeInterval } from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

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


  setIntervals() {
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
    }, 600000);
  }
  reset() {
    this.second.next(0);
    this.minute.next(0);
    this.hour.next(0);
  }

  // setPath(id: number): void {
  //   this.id.next(1);
  //   this.id.next(id);
  // }

}
