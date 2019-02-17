import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { NewTaskFormComponent } from './new-task-form/new-task-form.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  styles: ['.row-image { width: 20px; height: auto; }' ]

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

  constructor(route: ActivatedRoute, public dialog: MatDialog, private router: Router) {
    super(route);
    this.paginationData.limit = 5;
  }

  ngOnInit() {
    if (this.router.url.split('/')[3] === 'employers') {
      this.pathEmployers = true;
    }
    this.setItems(this.headers);
    super.ngOnInit();
  }


  createTask() {
    const dialogRef = this.dialog.open(NewTaskFormComponent, {
      width: '650px',
      height: '810px'
    });

  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
