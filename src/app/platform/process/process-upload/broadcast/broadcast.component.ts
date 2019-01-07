import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material';
import {DateUpdateComponent} from './date-update/date-update.component';


@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.css'],
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        opacity: '0'
      })),
      state('active', style({
        display: 'block',
        opacity: '1'
      })),
      transition('active => inactive', animate('0ms ease-in')),
      transition('inactive => active', animate('300ms ease-in'))
    ])
  ]
})
export class BroadcastComponent implements OnInit {
  pageNumber = 1;
  valid: boolean;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {

  }

  dateUpdate() {
    const dialogRef = this.dialog.open(DateUpdateComponent, {
      height: '230px',
      width: '550px',
    });
    dialogRef.afterClosed().subscribe(
      data => console.log(data)
    );
  }


}
