import {Component,  OnInit} from '@angular/core';
import { MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-new-task-form',
  templateUrl: './new-task-form.component.html',
  styleUrls: ['./new-task-form.component.css']
})
export class NewTaskFormComponent implements OnInit {

  stage = 1;
  curDate;

  constructor( public dialogRef: MatDialogRef<NewTaskFormComponent>) { }

  ngOnInit() {
    this.curDate = new Date();
    console.log(this.curDate);
  }

  getStage() {
    if (this.stage === 1) {
      return 1;
    }
  }

  setStage(stage) {
    this.stage = stage;
    console.log(stage);
    this.getStage();
  }

}
