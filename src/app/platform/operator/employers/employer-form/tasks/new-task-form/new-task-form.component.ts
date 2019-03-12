import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import { EmployerService } from 'app/shared/_services/http/employer.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { TaskService } from 'app/shared/_services/http/task.service';
import { TaskModel } from 'app/shared/_models/task.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-new-task-form',
  templateUrl: './new-task-form.component.html',
  styleUrls: ['./new-task-form.component.css']
})
export class NewTaskFormComponent implements OnInit {

  status = 'not_started';
  curDate;
  employee;
  operator;
  operators = [];
  employees = [];

  constructor( public dialogRef: MatDialogRef<NewTaskFormComponent>,
               @Inject(MAT_DIALOG_DATA) public data: TaskModel,
               private employerService: EmployerService,
               private taskService: TaskService,
               private selectUnit: SelectUnitService,
               public convertDate: DatePipe) { }

  ngOnInit() {
    this.curDate = new Date();
    this.employerService.getOperator(this.selectUnit.currentEmployerID, 'employerId').then(response => {
      this.operators = response;
    });

    if (this.data)
    {
      this.status = this.data.status;
    }
  }

  createNewTask(form) {
    if (form.valid) {
      form.value['status'] = this.status;
      form.value['employerId'] = this.selectUnit.currentEmployerID;
      form.value['dueDate'] = this.convertDate.transform( form.value['date'], 'yyyy-MM-dd HH:mm:ss');
      this.taskService.createTask(form.value).then(response => {
        this.dialogRef.close();
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

}
