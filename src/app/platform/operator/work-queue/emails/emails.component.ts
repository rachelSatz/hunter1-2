import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { TimerService} from '../../../../shared/_services/http/timer';
import { startWith, switchMap} from 'rxjs/operators';
import { interval, Subscription} from 'rxjs';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.css']
})
export class EmailsComponent implements OnInit {
  public counter: number;
  mminutes = 0;
  hhours = 0;
  inter = <any>interval(10000);
  sub = new Subscription;
  constructor(public dialog: MatDialog,
              private timerService: TimerService) {
    timerService.getObservable().subscribe(val => this.counter = val);
  }

  ngOnInit() {
    this.sub = this.inter.pipe(
      startWith(0),
      switchMap(() => this.setMinutes())
    );



    // this.sub = Observable.interval(10000).takeWhile(() => true).subscribe(() => this.setMinutes());
  }

  setMinutes(): Observable<any>  {
    this.mminutes += 1;
    return;
  }




}
