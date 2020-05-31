import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { NotificationService } from 'app/shared/_services/notification.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { TaskService } from 'app/shared/_services/http/task.service';
import { TaskModel, Comment } from 'app/shared/_models/task.model';
import {CampaignsService} from '../../../../../../shared/_services/http/campains.service';
import {FormBuilder, Validators} from '@angular/forms';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {CampaignsFieldStatus} from '../../../../../../shared/_models/campaigns';

@Component({
  selector: 'app-new-task-form',
  templateUrl: './new-task-form.component.html',
  styleUrls: ['./new-task-form.component.css']
})
export class NewTaskFormComponent implements OnInit {
  task = this.fb.group({
      'name':        [null, Validators.required],
      'moduleType':  [null, Validators.required],
      'moduleName':  [null, Validators.required],
      'dateModule':  [null],
      'status':      [null],
      'employer':    [null, Validators.required],
      'performDate': [null],
      'performHour': [null],
      'description': [null],
  });
  status = 'in_progress';
  curDate;
  employee;
  operator;
  operators = [];
  employees = [];
  title = '';
  campaignsType = [];
  campaignsSubtype = [];
  dateModel = false;
  employers = [];

  statuses = Object.keys(CampaignsFieldStatus).map(function(e) {
    return { id: e, name: CampaignsFieldStatus[e] };
  });
  constructor( public dialogRef: MatDialogRef<NewTaskFormComponent>,
               @Inject(MAT_DIALOG_DATA) public data: TaskModel,
               public fb: FormBuilder,
               private employerService: EmployerService,
               public campaignsService: CampaignsService,
               private taskService: TaskService,
               private selectUnit: SelectUnitService,
               public convertDate: DatePipe,
               private notificationService: NotificationService) { }

  ngOnInit() {
    this.employerService.getEmployerBasic().then(response => {
      this.employers = response;
      if (this.employers.length > 1) {
        if (!this.employers.some(e => e.id === 0)) {
          this.employers.push({'id': '0', 'name': 'כלל המעסיקים'});
        }
      }
      this.employers.sort((a, b) => a.id - b.id);
    });
    this.campaignsService.getTypes().then(response => this.campaignsType = response);
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

  getSubtype(model) {
    if (model === 4) {
      this.task.get('moduleName').patchValue(10);
    } else {
      this.campaignsSubtype = [];
      this.campaignsSubtype = this.campaignsType.find(a => a.id === model).subtype;
      if (model === 1 || model === 2) {
        this.dateModel = true;
      }
    }
  }

  createNewTask(form) {
    if (this.task.valid) {
      this.task.get('status').patchValue(this.status)
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
