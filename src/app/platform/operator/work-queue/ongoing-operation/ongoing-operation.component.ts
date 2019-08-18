import { MatDialog } from '@angular/material';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';

import { PlanTask } from 'app/shared/_models/plan-task';
import { FileType } from 'app/shared/_models/group-thing';
import { Process } from 'app/shared/_models/process.model';
import { TimerService } from 'app/shared/_services/http/timer';
import { PlanService } from 'app/shared/_services/http/plan.service';
import { TaskTimer, TaskTimerLabels } from 'app/shared/_models/timer.model';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { OperatorTasksService } from 'app/shared/_services/http/operator-tasks';
import { PlatformComponent } from '../../../platform.component';
import { EmployeeStatus } from 'app/shared/_models/monthly-transfer-block';

@Component({
  selector: 'app-ongoing-operation',
  templateUrl: './ongoing-operation.component.html',
  styleUrls: ['./ongoing-operation.component.css']
})
export class OngoingOperationComponent implements OnInit, OnDestroy {
  text: string;
  plan: PlanTask;
  path: string;
  task_timer_id: any;
  taskObj = new TaskTimer;
  seconds: string;
  minutes: string;
  hours: string;
  isRecord = false;
  isFile = false;
  isCompensation = false;
  fileType = FileType;
  employeeStatus = EmployeeStatus;

  constructor(protected route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              protected notificationService: NotificationService,
              public processDataService: ProcessDataService,
              private planService: PlanService,
              private selectUnit: SelectUnitService,
              private timerService: TimerService,
              private operatorTasks: OperatorTasksService,
              private platformComponent: PlatformComponent) { }

  ngOnInit() {
    this.text = (this.route.snapshot.routeConfig.path) ? this.route.snapshot.routeConfig.path : '';
    this.timerService.reset();
    this.newTaskTimer('ongoing_operation');
    this.fetchItems();
  }

  fetchItems(): void {
    this.planService.getSinglePlan().then(response => {
      if (response['message'] === 'No plan found' || response['message'] === 'No task found') {
      } else if (response['message'] === 'Success!') {
        this.plan = response['data'];
        if (this.plan !== null && this.plan.task !== null) {
          if (this.plan.task.record !== undefined) {
            this.isRecord = true;
          } else if (this.plan.task.file !== undefined) {
            this.isFile = true;
          }
        }
      }
    });
  }
  taskCompletedDialog(): void {
    const processId = this.plan.task.process.id;
    if (this.isRecord) {
      if (this.plan.type.id === 8) {
        this.platformComponent.isWorkQueue = true;
        this.platformComponent.organizationId = this.plan.organization.id;
        this.platformComponent.employerId = this.plan.employer.id;
        this.platformComponent.departmentId = this.plan.department.id;
        this.selectUnit.changeOrganizationEmployerDepartment(this.plan.organization.id, this.plan.employer.id, this.plan.department.id);
        this.platformComponent.agentBarActive = !this.platformComponent.agentBarActive;
        this.router.navigate(['/platform', 'feedback', 'employees' ],
          { queryParams: { recordId: this.plan.task.record.id }});
      } else {
        this.processDataService.activeProcess = new Process();
        const data = {'processId': processId, 'highlightRecordId': this.plan.task.record.id};
        this.processDataService.setProcess(data);
        this.router.navigate(['/platform', 'process', 'new', 1, 'details', 'records']);
      }
    } else if (this.isFile) {
      if (this.plan.type.id === 8) {
        this.platformComponent.isWorkQueue = true;
        this.platformComponent.organizationId = this.plan.organization.id;
        this.platformComponent.employerId = this.plan.employer.id;
        this.platformComponent.departmentId = this.plan.department.id;
        this.selectUnit.changeOrganizationEmployerDepartment(this.plan.organization.id, this.plan.employer.id, this.plan.department.id);
        this.platformComponent.agentBarActive = !this.platformComponent.agentBarActive;
        this.router.navigate(['/platform', 'feedback', 'files' ],
          { queryParams: {  fileId: this.plan.task.file.id }});
      } else {
        this.processDataService.activeProcess = new Process();
        const data = {'processId': processId, 'highlightFileId': this.plan.task.file.id};
        this.processDataService.setProcess(data);

        this.router.navigate(['/platform', 'process', 'new', 1, 'details', 'files']);
      }
    } else if (this.isCompensation) {
      this.router.navigate(['/platform', 'compensations', 'process', 94]);
    }
  }

  // skipTaskDialog(): void {
  //   this.fetchItems();
  //   // this.dialog.open(SkipTaskComponent, {
  //   //   width: '660px',
  //   //   height: '240px'
  //   // });
  // }

  newTaskTimer(taskType: string): void {
    this.operatorTasks.newTaskTimer(taskType).then(
      response => {
        if (response > 0 ) {
          this.task_timer_id = response;
          this.taskObj.id = response;
          this.selectUnit.setTaskTimer(this.taskObj);
        }
      });
  }
  updateTaskTimer(duration: string): void {
    if (this.task_timer_id > 0) {
      this.operatorTasks.updateTaskTimer(this.task_timer_id, duration).then(
        response => response);
    }
  }

  ngOnDestroy() {
    this.router.events.subscribe(a => {
      if (a instanceof NavigationStart) {
        if (Object.values(TaskTimerLabels).some(c => c === a.url)) {
          const time = this.hours + ':' + this.minutes + ':' + this.seconds;
          this.updateTaskTimer(time);
          this.selectUnit.clearTaskTimer();
        }
      }
    });
  }
}
