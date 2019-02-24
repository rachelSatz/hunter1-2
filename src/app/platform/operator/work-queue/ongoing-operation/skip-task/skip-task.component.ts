import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-skip-task',
  templateUrl: './skip-task.component.html',
  animations: [ fade ]
})
export class SkipTaskComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SkipTaskComponent>) { }

  ngOnInit() {
  }

}
