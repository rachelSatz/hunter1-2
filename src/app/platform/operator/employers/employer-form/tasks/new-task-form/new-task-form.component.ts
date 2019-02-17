import { Component,  OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-new-task-form',
  templateUrl: './new-task-form.component.html',
  styleUrls: ['./new-task-form.component.css']
})
export class NewTaskFormComponent implements OnInit {

  stage = 1;
  curDate;
  employee;
  executive;
  executives = [
    {name: 'tim', id: 1},
    {name: 'bock', id: 2},
    {name: 'choi', id: 3}
    ];

  constructor( public dialogRef: MatDialogRef<NewTaskFormComponent>) { }

  ngOnInit() {
    this.curDate = new Date();
    console.log(this.curDate);
  }


  setStage(stage) {
    this.stage = stage;
  }

  createNewTask(form) {
    if (form.valid) {
      console.log(form.value);
      console.log(this.stage);
      this.dialogRef.close();
    }
  }

  close() {
    this.dialogRef.close();
  }

}
