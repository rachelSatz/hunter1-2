import { MatDialog } from '@angular/material';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Process, ProcessType } from 'app/shared/_models/process.model';
import { PlanTask } from 'app/shared/_models/plan-task';
import { FileType } from 'app/shared/_models/group-thing';
import { CompensationStatus, CompensationSendingMethods } from 'app/shared/_models/compensation.model';
import { TimerService } from 'app/shared/_services/http/timer';
import { PlanService } from 'app/shared/_services/http/plan.service';
import { TaskTimerLabels } from 'app/shared/_models/timer.model';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { OperatorTasksService } from 'app/shared/_services/http/operator-tasks';
import { PlatformComponent } from '../../../platform.component';
import { EmployeeStatus } from 'app/shared/_models/monthly-transfer-block';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { UserSessionService} from '../../../../shared/_services/user-session.service';
import { CategoryTypeCompensation, CategoryTypeEmployerError, CategoryTypeFeedback,
  CategoryTypeEmployerDefrayal} from '../../../../shared/_models/plan';
import {Subscription} from 'rxjs';


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
  seconds: string;
  minutes: string;
  hours: string;
  noMorePlans = false;
  noMoreTask = false;
  fileType = FileType;
  employeeStatus = EmployeeStatus;
  sub = new Subscription;
  errorsDetails = {
    compensationEmployer: {ids: [24, 26], error: false, title : 'ייתרות לפיצויים ברמת ח.פ', function: 'compensationEmployer'},
    compensationEmployee: {ids: [25, 23], error: false, title : 'ייתרות לפיצויים ברמת עובד', function: 'compensationEmployee'},
    employerNotDefrayal: {ids: [40, 42], error: false, title : 'מעסיק שלא נסלק', function: 'employerNotDefrayal'},
    fileLoading: {ids: [24, 26], error: false, title : 'שגיאה בהעלאת קובץ', function: 'errorLoadingFile'},
    fileTransmit: {ids: [24, 26], error: false, title : 'שגיאה בשידור קובץ', function: 'errorLoadingFile', comment: 'שגיאת שידור'},
    fileError: {ids: [41, 4, 3, 1], error: false, title : 'שגיאת קובץ לפני שידור', function: 'errorLoadingFile'},
    paymentInstructions: {ids: [2], error: false, title : 'שליחת הנחיות לתשלום', function: 'paymentInstructionsError'},
    file: {ids: [5, 6, 7, 22, 8], error: false, title : 'שגיאה בהיזון חוזר', function: 'fileToExecute'},
    record: {ids: [18, 20], error: false, title : 'שגיאה בהיזון חוזר', function: 'recordToExecute'},
    employerError: { ids: [34, 33, 32, 31, 28, 27], error: false, title : 'הקמת מעסיק', function: 'employerError'}

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
          for (const error in this.errorsDetails) {
             if (this.errorsDetails[error].ids.includes(this.plan.type.id)) {
               this.errorsDetails[error].error = true;
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
    if (this.getCurrentError() !== 'employerError' && this.plan.type.id !== CategoryTypeEmployerDefrayal.employerEstablishmentXml) {
      if (this.getCurrentError() !== 'compensationEmployer') {
        this.platformComponent.employerId = this.plan.employer.id;
        this.platformComponent.departmentId = this.plan.department.id;
        this.selectUnit.changeOrganizationEmployerDepartment(this.plan.organization.id, this.plan.employer.id, this.plan.department.id);
      } else {
        this.selectUnit.changeOrganization(this.plan.organization.id);
      }
      this.platformComponent.agentBarActive = !this.platformComponent.agentBarActive;
      this.selectUnit.setAgentBarActive(this.platformComponent.agentBarActive);
    }
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
    if (Object.values(CategoryTypeFeedback).indexOf(this.plan.type.id)  !== -1) {
      this.router.navigate(['/platform', 'feedback', 'employees' ],
        { queryParams: { recordId: this.plan.task.record.id , planId: this.plan.id}});
    } else {
      this.processDataService.activeProcess = new Process();
      const data = {'processId': this.plan.task.process.id, 'highlightRecordId': this.plan.task.record.id};
      this.processDataService.setProcess(data);
      this.selectUnit.setProcessData(this.processDataService);
      this.router.navigate(['/platform', 'process', 'new', 1, 'details', 'records']);
    }
  }

  fileToExecute(): void {
    if (Object.values(CategoryTypeFeedback).indexOf(this.plan.type.id)  !== -1) {
      this.router.navigate(['/platform', 'feedback', 'files' ],
        { queryParams: { fileId: this.plan.task.file.id , planId: this.plan.id}});
    } else {
      this.processDataService.activeProcess = new Process();
      const data = {'processId': this.plan.task.process.id, 'highlightFileId': this.plan.task.file.id};
      this.processDataService.setProcess(data);
      this.selectUnit.setProcessData(this.processDataService);
      this.router.navigate(['/platform', 'process', 'new', 1, 'details', 'files']);
    }
  }

  errorLoadingFile(): void {
    this.router.navigate(['/platform', 'process', 'table' ],
      { queryParams: { processId: this.plan.task.process.id, planId: this.plan.id}});
  }

  employerNotDefrayal(): void {
    this.router.navigate(['/platform', 'process', 'new',  'create']);
  }

  paymentInstructionsError(): void {
    this.router.navigate(['/platform', 'process', 'new', 0, 'payment', this.plan.task.process.id],
      {queryParams: { page: 3, planId: this.plan.id}});
  }

  employerError(): void {
    let pageNum = 1;
    let navigate;
    if (this.plan.task.employer.status === 'on_process' || this.plan.task.employer.status === 'moved_association') {
      if (this.plan.type.id === CategoryTypeEmployerError.employerEstablishmentErrorContact) {
        pageNum = 1;
      } else if (this.plan.type.id === CategoryTypeEmployerError.employerEstablishmentErrorPa ||
                  this.plan.type.id === CategoryTypeEmployerError.employerEstablishmentErrorProtocol ||
                  this.plan.type.id === CategoryTypeEmployerError.employerEstablishmentErrorContract) {
        pageNum = 3;
      } else if (this.plan.type.id === CategoryTypeEmployerError.employerEstablishmentErrorBankAccount) {
        pageNum = 4;
      }
      this.router.navigate(['/platform', 'operator', 'employers', 'creating', this.plan.task.employer.id],
        {queryParams: { page: pageNum, planId: this.plan.id}});
    } else if (this.plan.task.employer.status === 'active') {
      if (this.plan.type.id === CategoryTypeEmployerError.employerEstablishmentErrorContact) {
        navigate = 'contacts';
      } else if (this.plan.type.id === CategoryTypeEmployerError.employerEstablishmentErrorPa ||
        this.plan.type.id === CategoryTypeEmployerError.employerEstablishmentErrorProtocol ||
        this.plan.type.id === CategoryTypeEmployerError.employerEstablishmentErrorContract) {
        navigate = 'documents';
      } else if (this.plan.type.id === CategoryTypeEmployerError.employerEstablishmentErrorBankAccount) {
        navigate = 'departments';
      }
      this.router.navigate(['/platform', 'operator', 'employers', 'form', this.plan.task.employer.id, navigate],
        {queryParams: {planId: this.plan.id}});
    }
  }

  taskCompletedDialog(): void {
    this.operatorTasks.newTaskTimer('ongoing_operation').then(
      response => {
        if (response > 0 ) {
          const data = {id: response, type: this.plan.type.name, employer: this.plan.employer.name,
            organization: this.plan.organization.name, planTaskId: this.plan.id
          };
          this.selectUnit.setTaskTimer(data);
          this.initializationPlatform();
          const error = this.getCurrentError();
          this[this.errorsDetails[error].function]();
        }
      });
  }

  compensationEmployee(): void {
    if (this.plan.type.id === CategoryTypeCompensation.compensationEmployeeType ||
      this.plan.type.id === CategoryTypeCompensation.compensationEmployeeSendType) {
      this.router.navigate(['/platform', 'compensation', 'process' ],
        { queryParams: { id: this.plan.task.compensation.id , planId: this.plan.id}});
    }
  }

  compensationEmployer(): void {
    if (this.plan.type.id === CategoryTypeCompensation.compensationEmployerType ||
      this.plan.type.id === CategoryTypeCompensation.compensationEmployerSendType) {
      this.router.navigate(['/platform', 'compensation', 'process-level-hp' ],
        { queryParams: { id: this.plan.task.compensation.id , planId: this.plan.id}});
    }
  }

  // skipTaskDialog(): void {
  //   this.fetchItems();
  //   // this.dialog.open(SkipTaskComponent, {
  //   //   width: '660px',
  //   //   height: '240px'
  //   // });
  // }

  newPlanTaskTimer(taskType, planTaskId, type, employer, organization): void {
    this.operatorTasks.newTaskTimer(taskType).then(
      response => {
        if (response > 0 ) {
          const data = {
            id: response,
            type: type,
            employer: employer,
            organization: organization
          };
          this.selectUnit.setTaskTimer(data);
        }
      });
  }
  //
  // newTaskTimer(taskType: string, planTaskId?: number): void {
  //   this.operatorTasks.newTaskTimer(taskType, planTaskId).then(
  //     response => {
  //       if (response > 0 ) {
  //         this.task_timer_id = response;
  //         this.taskObj.id = response;
  //         this.selectUnit.setTaskTimer(this.taskObj);
  //       }
  //     });
  // }

  updateTaskTimer(duration: string): void {
    if (this.task_timer_id > 0) {
      this.operatorTasks.updateTaskTimer(this.task_timer_id, duration, 'task').then(
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
