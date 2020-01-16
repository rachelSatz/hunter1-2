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
import { UserSessionService} from '../../../../shared/_services/user-session.service';
import { CategoryTypeCompensation, CategoryTypeEmployerError,
         CategoryTypErrors, CategoryTypeFeedback} from '../../../../shared/_models/plan';


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

  errorsDetails = {
    compensationEmployer: {error: false, title : 'ייתרות לפיצויים ברמת ח.פ', function: 'compensationEmployerToExecute'},
    compensationEmployee: {error: false, title : 'ייתרות לפיצויים ברמת עובד', function: 'compensationEmployeeToExecute'},
    fileLoading: {error: false, title : 'שגיאה בהעלאת קובץ', function: 'errorLoadingFileToExecute'},
    fileTransmit: {error: false, title : 'שגיאה בשידור קובץ', function: 'errorLoadingFileToExecute', comment: 'שגיאת שידור'},
    fileError: {error: false, title : 'שגיאת קובץ לפני שידור', function: 'errorLoadingFileToExecute'},
    paymentInstructions: {error: false, title : 'שליחת הנחיות לתשלום', function: 'paymentInstructionsErrorToExecute'},
    file: {error: false, title : 'שגיאה בהיזון חוזר', function: 'fileToExecute'},
    record: {error: false, title : 'שגיאה בהיזון חוזר', function: 'recordToExecute'},
    employerError: { error: false, title : 'הקמת מעסיק', function: 'employerErrorToExecute'}

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
          if (Object.values(CategoryTypeEmployerError).indexOf(this.plan.type.id)  !== -1) {
            this.errorsDetails['employerError'].error = true;
          } else {
            switch (this.plan.type.id) {
              case CategoryTypErrors.fileUploadError:
              case CategoryTypErrors.fileTransmittedError: this.errorsDetails['fileError'].error = true; break;
              case CategoryTypeFeedback.recordInProgress:
              case CategoryTypeFeedback.recordPaidFailed: this.errorsDetails['record'].error = true; break;
              case CategoryTypeFeedback.fileNegPaidFailed:
              case CategoryTypeFeedback.fileNegPartiallyPaid:
              case CategoryTypeFeedback.fileOngPaidFailed:
              case CategoryTypeFeedback.fileOngPartiallyPaid:
              case CategoryTypeFeedback.fileInProgress: this.errorsDetails['file'].error = true; break;
              case CategoryTypErrors.paymentInstructions: this.errorsDetails['paymentInstructions'].error = true; break;
              case CategoryTypeCompensation.compensationEmployeeType:
              case CategoryTypeCompensation.compensationEmployeeSendType: this.errorsDetails['compensationEmployee'].error = true; break;
              case CategoryTypeCompensation.compensationEmployerType:
              case CategoryTypeCompensation.compensationEmployerSendType: this.errorsDetails['compensationEmployer'].error = true; break;
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
    if (this.getCurrentError() !== 'employerError') {
      if (this.getCurrentError() !== 'compensationEmployer') {
        this.platformComponent.employerId = this.plan.employer.id;
        this.platformComponent.departmentId = this.plan.department.id;
        this.selectUnit.changeOrganizationEmployerDepartment(this.plan.organization.id, this.plan.employer.id, this.plan.department.id);
      } else {
        this.selectUnit.changeOrganization(this.plan.organization.id);
      }
      this.platformComponent.agentBarActive = !this.platformComponent.agentBarActive;
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
      this.router.navigate(['/platform', 'process', 'new', 1, 'details', 'files']);
    }
  }

  errorLoadingFileToExecute(): void {
    this.router.navigate(['/platform', 'process', 'table' ],
      { queryParams: { processId: this.plan.task.process.id, planId: this.plan.id}});
  }

  paymentInstructionsErrorToExecute(): void {
    this.router.navigate(['/platform', 'process', 'new', 0, 'payment', this.plan.task.process.id],
      {queryParams: { page: 3, planId: this.plan.id}});
  }

  employerErrorToExecute(): void {
    let pageNum = 1;
    let navigate;
    if (this.plan.task.employer.status === 'on_process') {
      if (this.plan.type.id === CategoryTypeEmployerError.employerEstablishmentErrorContact) {
        pageNum = 1;
      } else if (this.plan.type.id === CategoryTypeEmployerError.employerEstablishmentErrorPa ||
                  this.plan.type.id === CategoryTypeEmployerError.employerEstablishmentErrorProtocol ) {
        pageNum = 3;
      } else if (this.plan.type.id === CategoryTypeEmployerError.employerEstablishmentErrorContract) {
        pageNum = 2;
      }else if (this.plan.type.id === CategoryTypeEmployerError.employerEstablishmentErrorBankAccount) {
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
    this.initializationPlatform();
    const error = this.getCurrentError();
    this[this.errorsDetails[error].function]();
  }

  compensationEmployeeToExecute(): void {
    if (this.plan.type.id === CategoryTypeCompensation.compensationEmployeeType ||
      this.plan.type.id === CategoryTypeCompensation.compensationEmployeeSendType) {
      this.router.navigate(['/platform', 'compensation', 'process' ],
        { queryParams: { id: this.plan.task.compensation.id , planId: this.plan.id}});
    }
  }

  compensationEmployerToExecute(): void {
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
