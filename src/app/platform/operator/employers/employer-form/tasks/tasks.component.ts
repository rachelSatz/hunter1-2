import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { NewTaskFormComponent } from './new-task-form/new-task-form.component';
import { TaskService } from 'app/shared/_services/http/task.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { TaskModel, TaskStatus} from 'app/shared/_models/task.model';
import { UserSessionService} from 'app/shared/_services/user-session.service';
import { Subscription} from 'rxjs';
import {HelpersService} from '../../../../../shared/_services/helpers.service';
import {CategoryTypeEmployerDefrayal, CategoryTypeFeedback} from '../../../../../shared/_models/plan';
import {OperatorTasksService} from '../../../../../shared/_services/http/operator-tasks';
import {PlatformComponent} from '../../../../platform.component';
import {TimerService} from '../../../../../shared/_services/http/timer';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styles: ['.operator-container {margin-right: 60px}']
})
export class TasksComponent implements OnInit  {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;
  taskStatus = TaskStatus;
  sub = new Subscription;
  organization;
  pathEmployers = false;
  permissionsType = this.userSession.getPermissionsType('operations');

  readonly filter =  [
    {id: 9 , label: 'טעינת קובץ' , selected: true},
    {id: 0 , label: 'המשימות שלי' , selected: false},
  ];

  readonly columns =  [
    { name: 'month', label: 'חודש' , searchable: false},
    { name: 'typeTask', label: 'המשימה' , searchable: false},
    { name: 'subtypeTask', label: 'תת משימה' , searchable: false},
    { name: 'creator', label: 'יוצר המשימה' , searchable: false},
    { name: 'operator', label: 'מבצע המשימה' , searchable: false},
    { name: 'employer', label: 'מעסיק' , searchable: false},
    { name: 'status', label: 'סטטוס' , searchable: false},
    ];

  constructor(protected route: ActivatedRoute,
              public dialog: MatDialog,
              public helpers: HelpersService,
              private router: Router,
              public timerService: TimerService,
              private operatorTasks: OperatorTasksService,
              private userSession: UserSessionService,
              private taskService: TaskService,
              private selectUnit: SelectUnitService,
              private platformComponent: PlatformComponent) {
  }

  ngOnInit() {
    if (this.router.url.includes('employers')) {
      this.pathEmployers = true;
    }
    if (this.route.snapshot.queryParams['isSelfTask']) {
      this.dataTable.criteria.filters['typeTask'] = 0;
      this.filter[0].selected = false;
      this.filter[1].selected = true;
    }
  }

  fetchItems() {
    this.taskService.getTasks(this.selectUnit.currentEmployerID, this.dataTable.criteria)
      .then(response => {
        this.helpers.setPageSpinner(false);
        this.dataTable.setItems(response);
      });
  }

  ExecutionTask(item) {
    this.organization = (this.selectUnit.getOrganization()).find(o => o.employer.find(e => e.id === item.employer.id));
    this.operatorTasks.newTaskTimer(null, item.id).then(
      response => {
        if (response > 0 ) {
          if (this.selectUnit.getTaskTimer()) {
            const time = this.timerService.hour.value + ':' + this.timerService.minute.value + ':' + this.timerService.second.value;
            this.operatorTasks.updateTaskTimer(this.selectUnit.getTaskTimer()['id'], time, 'task').then(
              responseA => responseA);
            this.selectUnit.clearTaskTimer();
          }
          const isSelfTask = this.filter[1].selected === true ? true : false;
          const data = {id: response, type: item.subtypeTask, employer: item.employer.name,
            organization: this.organization.name, taskCampaignId: item.id, isSelfTask: isSelfTask};
          this.initializationPlatform(item);
          this.timerService.reset();
          this.selectUnit.setTaskTimer(data);
          if (!this.filter[1].selected === true) {
            if (item.subtypeTask === 'טעינת קובץ') {
              this.router.navigate(['/platform', 'process', 'new', 'create']);
            }
          } else {
            this.router.navigate(['/platform', 'process', 'table']);
          }
        }
      });
  }

  stopTask(item): void {
    this.operatorTasks.taskCompleted(item.id).then(
      response => {
        if (response) {
          this.fetchItems();
          this.selectUnit.clearTaskTimer();
        }
      }
    );
  }

  isStopTask(item): boolean {
    const t = this.selectUnit.getTaskTimer();
    return t && t.isSelfTask && item.id === t.taskCampaignId;
  }

  initializationPlatform(item): void {
    this.platformComponent.isWorkQueue = false;
    this.platformComponent.isTask = true;
    this.platformComponent.organizationId = this.organization.id;
    this.platformComponent.employerId = item.employer.id;
    this.platformComponent.departmentId = 0;
    this.selectUnit.changeOrganizationEmployerDepartment(Number(this.organization.id), item.employer.id, 0);
    this.platformComponent.agentBarActive = !this.platformComponent.agentBarActive;
    this.selectUnit.setAgentBarActive(this.platformComponent.agentBarActive);
  }

  search(event?: KeyboardEvent): void {
    if (((event && (event.code === 'Enter' || event.code === 'NumpadEnter')) || !event)) {
      if (this.dataTable.criteria.page  > 1) {
        this.dataTable.criteria.page = 1;
      }
      this.fetchItems();
    }
  }

  filterResult(id) {
    this.filter.forEach( f => {
      if (f['id'] === id) {f.selected = true; } else {f.selected = false; }
    } );
    this.helpers.setPageSpinner(true);
    this.dataTable.criteria.filters['typeTask'] = id;
    this.fetchItems();
  }

  createOrEditTask(item: any) {
   if (!item) {
     item = new TaskModel;
     item.employer['id'] = this.selectUnit.currentEmployerID;
   }
   const dialog = this.dialog.open(NewTaskFormComponent, {
      data: item,
      width: '600px',
    });

    dialog.afterClosed().subscribe(
      data => {
        if (data) {
          this.fetchItems();
        }
      });
  }

}
