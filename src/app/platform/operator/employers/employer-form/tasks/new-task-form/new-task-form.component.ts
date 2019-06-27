import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import { NotificationService } from 'app/shared/_services/notification.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { TaskService } from 'app/shared/_services/http/task.service';
import { TaskModel, Comment } from 'app/shared/_models/task.model';
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
  title = '';

  constructor( public dialogRef: MatDialogRef<NewTaskFormComponent>,
               @Inject(MAT_DIALOG_DATA) public data: TaskModel,
               private employerService: EmployerService,
               private taskService: TaskService,
               private selectUnit: SelectUnitService,
               public convertDate: DatePipe,
               private notificationService: NotificationService) { }

  ngOnInit() {
    if (this.data.subject !== null && this.data.subject !== '') {
      this.title = 'עריכת משימה';
    } else {
      this.title = 'יצירת משימה חדשה';
    }
    this.curDate = new Date();


    if (this.data.status) {
      this.status = this.data.status;
      if (this.data.comments.length === 0) {
        this.data.comments.push(new Comment());
      }

    }
    // this.data.employer['id'], 'employerId'
    this.employerService.getOperator().then(response => {
      this.operators = response;
    });
  }

  createNewTask(form) {
    if (form.valid) {
      form.value['status'] = this.status;
      form.value['employerId'] = this.selectUnit.currentEmployerID;
      form.value['dueDate'] = this.convertDate.transform( form.value['date']  , 'yyyy-MM-dd');
      form.value['dueDate'] = form.value['dueDate'] + ' ' + form.value['hour']
      this.taskService.createTask(form.value).then(response => {
        if (response.includes('Could not update')) {
          this.notificationService.error('', 'אירעה שגיאה');
        }else {
          this.close(true);
        }
      });
    }
  }

  close(addTask: boolean) {
    this.dialogRef.close(addTask);
  }

}
