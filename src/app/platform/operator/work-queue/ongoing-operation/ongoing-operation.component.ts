import { MatDialog } from '@angular/material';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Process, ProcessType } from 'app/shared/_models/process.model';
import { PlanTask } from 'app/shared/_models/plan-task';
import { FileType } from 'app/shared/_models/group-thing';
import { CompensationStatus, CompensationSendingMethods } from 'app/shared/_models/compensation.model';
import { TimerService } from 'app/shared/_services/http/timer';
import { PlanService } from 'app/shared/_services/http/plan.service';
import { TaskTimer, TaskTimerLabels } from 'app/shared/_models/timer.model';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { OperatorTasksService } from 'app/shared/_services/http/operator-tasks';
import { PlatformComponent } from '../../../platform.component';
import { EmployeeStatus } from 'app/shared/_models/monthly-transfer-block';
import { HelpersService } from 'app/shared/_services/helpers.service';
import {UserSessionService} from '../../../../shared/_services/user-session.service';


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
  noMorePlans = false;
  noMoreTask = false;
  fileType = FileType;
  employeeStatus = EmployeeStatus;
  feedbackError = [5, 6, 7, 8, 18, 20, 22];
  compensationType = 23

  errorsDetails = {
    compensationEmployer: {error: false, title : 'ייתרות לפיצויים ברמת ח.פ', function: 'recordToExecute'},
    compensationEmployee: {error: false, title : 'ייתרות לפיצויים ברמת עובד', function: 'compensationEmployeeToExecute'},
    fileLoading: {error: false, title : 'שגיאה בהעלת קובץ', function: 'errorLoadingFileToExecute'},
    fileTransmit: {error: false, title : 'שגיאה בשידור קובץ', function: 'errorLoadingFileToExecute', comment: 'שגיאת שידור'},
    paymentInstructions: {error: false, title : 'שליחת הנחיות לתשלום', function: 'paymentInstructionsErrorToExecute'},
    file: {error: false, title : 'שגיאה בהיזון חוזר', function: 'fileToExecute'},
    record: {error: false, title : 'שגיאה בהיזון חוזר', function: 'recordToExecute'},
  };

  constructor(protected route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private userSession: UserSessionService,
              protected notificationService: NotificationService,
              public processDataService: ProcessDataService,
              private planService: PlanService,
              private selectUnit: SelectUnitService,
              private timerService: TimerService,
              private operatorTasks: OperatorTasksService,
              private helpers: HelpersService,
              private platformComponent: PlatformComponent) { }

  ngOnInit() {
    this.text = (this.route.snapshot.routeConfig.path) ? this.route.snapshot.routeConfig.path : '';
    this.timerService.reset();
    this.newTaskTimer('ongoing_operation');
    this.fetchItems();
  }

  fetchItems(): void {
    this.helpers.setPageSpinner(true);
    this.planService.getSinglePlan().then(response => {
      if (response['message'] === 'No plan found' ) {
        this.noMorePlans = true;
      } else if ( response['message'] === 'No task found') {
        this.noMoreTask = true;
      } else if (response['message'] === 'Success!') {
        this.plan = response['data'];
        if (this.plan !== null && this.plan.task !== null) {
          if (this.plan.task.record !== undefined) {
            this.errorsDetails['record'].error = true;
          } else if (this.plan.task.file !== undefined) {
            this.errorsDetails['file'].error = true;
          } else if (this.plan.task.compensation) {
            this.errorsDetails['compensationEmployee'].error = true;
          } else if (this.plan.task.process.error_details !== undefined) {
            if (this.plan.task.process.status === 'No Payment instructions') {
              this.errorsDetails['paymentInstructions'].error = true;
            } else if (this.plan.task.process.status === 'error_transmiting') {
              this.errorsDetails['fileTransmit'].error = true;
            } else {
              this.errorsDetails['fileLoading'].error = true;
            }
          }
        }
      }
      this.helpers.setPageSpinner(false);
    });
  }

  initializationPlatform(): void {
    this.platformComponent.isWorkQueue = true;
    this.platformComponent.organizationId = this.plan.organization.id;
    this.platformComponent.employerId = this.plan.employer.id;
    this.platformComponent.departmentId = this.plan.department.id;
    this.selectUnit.changeOrganizationEmployerDepartment(this.plan.organization.id, this.plan.employer.id, this.plan.department.id);
    this.platformComponent.agentBarActive = !this.platformComponent.agentBarActive;
  }

  getCurrentError(): any {
    for (const error in this.errorsDetails) {
      if (this.errorsDetails[error].error === true) {
        return error;
      }
    }
  }

  getType(): string {
    return ProcessType[this.plan.task.process.type];
  }
  getTypeSendingMethods(): string {
    return CompensationSendingMethods[this.plan.task.compensation.sending_method];
  }

  getStatus(): string {
    return CompensationStatus[this.plan.task.compensation.status];
  }

  recordToExecute(): void {
    if ( this.feedbackError.indexOf(this.plan.type.id)  !== -1) {
      this.router.navigate(['/platform', 'feedback', 'employees' ],
        { queryParams: { recordId: this.plan.task.record.id , planId: this.plan.id}});
    } else {
      this.processDataService.activeProcess = new Process();
      const data = {'processId': this.plan.task.process.id, 'highlightRecordId': this.plan.task.record.id};
      this.processDataService.setProcess(data);
      this.router.navigate(['/platform', 'process', 'new', 1, 'details', 'records']);
    }
  }

  fileToExecute(): void {
    if ( this.feedbackError.indexOf(this.plan.type.id) !== -1) {
      this.router.navigate(['/platform', 'feedback', 'files' ],
        { queryParams: { fileId: this.plan.task.file.id , planId: this.plan.id}});
    } else {
      this.processDataService.activeProcess = new Process();
      const data = {'processId': this.plan.task.process.id, 'highlightFileId': this.plan.task.file.id};
      this.processDataService.setProcess(data);
      this.router.navigate(['/platform', 'process', 'new', 1, 'details', 'files']);
    }
  }

  errorLoadingFileToExecute(): void {
    this.router.navigate(['/platform', 'process', 'table' ],
      { queryParams: { processId: this.plan.task.process.id }});
  }

  paymentInstructionsErrorToExecute() {
    this.router.navigate(['/platform', 'process', 'new', 0, 'payment', this.plan.task.process.id],
      {queryParams: { page: 3}});
  }

  taskCompletedDialog(): void {
    this.initializationPlatform();
    const error = this.getCurrentError();
    this[this.errorsDetails[error].function]();
  }

  compensationEmployeeToExecute(): void {
    if (this.plan.type.id === this.compensationType) {
      this.router.navigate(['/platform', 'compensation', 'process' ],
        { queryParams: { id: this.plan.task.compensation.id , planId: this.plan.id}});
    } else {
      this.processDataService.activeProcess = new Process();
      const data = {'processId': this.plan.task.process.id, 'highlightRecordId': this.plan.task.record.id};
      this.processDataService.setProcess(data);
      this.router.navigate(['/platform', 'process', 'new', 1, 'details', 'records']);
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
