import { Component, OnInit } from '@angular/core';
import {MatDatepickerModule, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-date-update',
  templateUrl: './date-update.component.html',
  providers: [MatDatepickerModule]
})
export class DateUpdateComponent implements OnInit {
  date: string;


  constructor( private dialogRef: MatDialogRef<string>) { }

  ngOnInit() {
  }

  submit() {
    this.dialogRef.close(this.date);
  }
}

