import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { NewTaskFormComponent } from './new-task-form/new-task-form.component';
import { TaskService } from 'app/shared/_services/http/task.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import {TaskModel} from '../../../../../shared/_models/task.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['../../../../../shared/data-table/data-table.component.css'],
})
export class TasksComponent extends DataTableComponent implements OnInit , OnDestroy {

  pathEmployers = false;

  readonly headers: DataTableHeader[] =  [
    { column: 'subject', label: 'נושא המשימה' },
    { column: 'createdBy', label: 'יוצר המשימה' },
    { column: 'createdAt', label: 'תאריך יצירה' },
    { column: 'executive', label: 'מבצע המשימה' },
    { column: 'executionDate', label: 'לביצוע עד' },
    { column: 'options', label: 'אפשרויות' }
  ];

  constructor(route: ActivatedRoute,
              public dialog: MatDialog,
              private router: Router,
              private taskService: TaskService,
              private selectUnit: SelectUnitService) {
    super(route);

  }

  ngOnInit() {
    if (this.router.url.includes('employers')) {
      this.pathEmployers = true;
      this.paginationData.limit = 5;
    }

    this.taskService.getTasks(this.selectUnit.currentEmployerID)
      .then(response => this.setItems(response));

    super.ngOnInit();
  }

  createOrEditTask(item : any) {
    if (!item)
      item = new TaskModel();
   this.dialog.open(NewTaskFormComponent, {
      data: item,
      width: '650px',
      height: '810px'
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
