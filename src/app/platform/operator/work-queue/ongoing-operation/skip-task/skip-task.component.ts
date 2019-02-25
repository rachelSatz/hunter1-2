import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { fade } from 'app/shared/_animations/animation';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-skip-task',
  templateUrl: './skip-task.component.html',
  animations: [ fade ]
})
export class SkipTaskComponent implements OnInit {
  hasServerError: boolean;

  constructor(public dialogRef: MatDialogRef<SkipTaskComponent>) { }

  ngOnInit() {
  }
  submit(form: NgForm): void {
    this.hasServerError = false;
    if (form.valid) {
      const aaa = form.value;
    }
  }
}
