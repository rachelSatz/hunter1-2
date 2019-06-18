import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { NewTaskFormComponent } from './new-task-form/new-task-form.component';
import { TaskService } from 'app/shared/_services/http/task.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { TaskModel } from 'app/shared/_models/task.model';
import {UserSessionService} from '../../../../../shared/_services/user-session.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit , OnDestroy {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  pathEmployers = false;
  permissionsType = this.userSession.getPermissionsType('operations');

  readonly columns =  [
    { name: 'employer', label: 'מעסיק' , searchable: false},
    { name: 'subject', label: 'נושא המשימה' , searchable: false},
    { name: 'createdBy', label: 'יוצר המשימה' , searchable: false},
    { name: 'createdAt', label: 'תאריך יצירה' , searchable: false},
    { name: 'executive', label: 'מבצע המשימה' , searchable: false},
    { name: 'executionDate', label: 'לביצוע עד' , searchable: false}
    ];

  constructor(route: ActivatedRoute,
              public dialog: MatDialog,
              private router: Router,
              private userSession: UserSessionService,
              private taskService: TaskService,
              private selectUnit: SelectUnitService) {
  }

  ngOnInit() {
    if (this.router.url.includes('employers')) {
      this.pathEmployers = true;
    }

    this.fetchItems();
  }

  fetchItems() {
    this.taskService.getTasks(this.selectUnit.currentEmployerID)
      .then(response => {
        this.dataTable.setItems(response);
      });
  }

  createOrEditTask(item: any) {
   if (!item) {
     item = new TaskModel();
     item.employer['id'] = this.selectUnit.currentEmployerID;
   }

   const dialog = this.dialog.open(NewTaskFormComponent, {
      data: item,
      width: '650px',
      height: '810px'
    });

    dialog.afterClosed().subscribe(
      data => {
        if (data) {
          this.fetchItems();
        }
      });
  }

  ngOnDestroy() {
  }
}
