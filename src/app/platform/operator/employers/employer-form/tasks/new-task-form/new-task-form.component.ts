import { Component,  OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { EmployerService } from 'app/shared/_services/http/employer.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import {TaskService} from '../../../../../../shared/_services/http/task.service';

@Component({
  selector: 'app-new-task-form',
  templateUrl: './new-task-form.component.html',
  styleUrls: ['./new-task-form.component.css']
})
export class NewTaskFormComponent implements OnInit {

  stage = 1;
  curDate;
  employee;
  operator;
  operators = [];
  employees = [];

  constructor( public dialogRef: MatDialogRef<NewTaskFormComponent>,
               private employerService: EmployerService,
               private taskService: TaskService,
               private selectUnit: SelectUnitService) { }

  ngOnInit() {
    this.curDate = new Date();
    this.employerService.getOperator(this.selectUnit.currentEmployerID, 'employerId').then(response => {
      this.operators = response;
    });
  }


  setStage(stage) {
    this.stage = stage;
  }

  createNewTask(form) {
    if (form.valid) {
      // console.log(form.value);
      // console.log(this.stage);
      this.taskService.createTask(form.value).then(response => {
        this.dialogRef.close();
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

}
