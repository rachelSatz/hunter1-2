import { NgForm } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router} from '@angular/router';
import { Component, OnInit} from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { Categories, Plan, TIMESTAMPS, CategoryTypeEmployerError } from 'app/shared/_models/plan';
import { NotificationService } from 'app/shared/_services/notification.service';
import { TaskService} from 'app/shared/_services/http/task.service';
import { PlanService} from 'app/shared/_services/http/plan.service';
import { UserService} from 'app/shared/_services/http/user.service';
import { TeamLeaderTask, User} from 'app/shared/_models/user.model';
import { Subscription } from 'rxjs';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {EmployerService} from '../../../../shared/_services/http/employer.service';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.css']
})
export class PlanFormComponent implements OnInit  {
  user = new User(null);
  plan = new Plan;
  types = [];
  subTypes = [];
  operators: User[] = [];
  timestamps = [];
  isSubmitFailed = false;
  isSubmitting = false;
  update = false;
  sub: Subscription;
  categoriesData = [];
  daysAmountTasks = [22, 23, 20, 24, 25, 26];
  employerEstablishmentError = Object.values(CategoryTypeEmployerError);
  date = '09/07/2019';
  inProgress = false;
  classAmount = 'w-20 mb-3 mr-3';
  userOfTeamLeader: string[];
  groups = Object.keys(TeamLeaderTask).map(function (e) {
    return {id: e, name: TeamLeaderTask[e]};
  });
  constructor(private router: Router,
              private route: ActivatedRoute,
              private taskService: TaskService,
              private planService: PlanService,
              private userService: UserService,
              public datePipe: DatePipe,
              private employerService: EmployerService,
              protected notificationService: NotificationService,
              private _location: Location) { }

  ngOnInit() {
    this.timestamps = TIMESTAMPS;
    if (this.route.snapshot.data.plan) {
      this.update = true;
      this.plan = this.route.snapshot.data.plan;
      if (this.plan.team_leader) {
        this.plan.team_leader = [this.route.snapshot.data.plan['team_leader']];
        if (this.plan.team_leader.indexOf('small_and_big_managers') !== -1 ) {
          this.plan.team_leader = ['small_employer_manager', 'big_employer_manager'];
        }
      }
    }
    this.employerService.getOperator().then(response => this.operators = response);
    this.planService.getTypes().then(response => this.types = response);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.categoriesData = event.container.data;
  }

  isCreatingEmployer(row): boolean {
    if (this.update) {
      if (row.salary_date_start !== null) {
        return true;
      } else {
        return false;
      }
    } else {
      if (this.employerEstablishmentError.indexOf(row.type.id) === -1) {
        return true;
      } else {
        return false;
      }
    }
  }
  checkUsersOfTeamLeader() {
    let isEquals = true;
    this.userOfTeamLeader.forEach( user => {
      if (this.plan.users.indexOf(user) === -1) {
        isEquals = false;
      }
    });
    return isEquals;
  }

  removeTeamLeader() {
    if (!this.checkUsersOfTeamLeader()) {
      this.plan.team_leader = null;
    }
  }

  setGroup() {
    this.plan.users = null;
    if (this.plan.team_leader) {
      this.userService.getOperatorOfTeamLeader(this.plan.team_leader).then(
        response => {
          if (response) {
            this.plan.users = response;
            this.userOfTeamLeader = response;
          }
        });
    }
  }

  addPlanRow(): void {
    this.plan.categories.push(new Categories());
  }

  deletePlanRow(index: number): void {
    this.plan.categories.splice(index, 1);
  }

  setDataSubType(typeId: any): void {
    if (this.daysAmountTasks.indexOf(typeId) !== -1) {
      this.inProgress = true;
      this.classAmount = 'w-10 mb-3 mr-3';
    } else {
      this.inProgress = false;
      this.classAmount = 'w-20 mb-3 mr-3';

    }
  }

  selectedSubType(typeId: any): void {
    this.subTypes = [];
    this.subTypes = this.types.find(a => a.id === typeId.type.id || a.id === typeId.type.name).subtypes;
    // } else if (index !== undefined) {
    //     //   this.subTypes = this.types.find(a => a.id === index.type.name).subtypes;
    //     // }
  }

  // selectedSubType(index: any, typeId: number): void {
  //   this.subTypes = [];
  //   if (typeId !== undefined) {
  //     this.subTypes = this.types.find(a => a.id === typeId).subtypes;
  //   } else if (index !== undefined) {
  //     this.subTypes = this.types.find(a => a.id === index.type.name).subtypes;
  //   }, row.id
  // }

  submit(form: NgForm): void {
    if (form.valid) {
        this.plan.categories.forEach(item => {
          item.salary_date_start = this.datePipe.transform(item.salary_date_start, 'yyyy-MM-dd');
          item.salary_date_end = this.datePipe.transform(item.salary_date_end, 'yyyy-MM-dd');
        });
        if (this.plan.team_leader && this.plan.team_leader.indexOf('small_employer_manager') !== -1 &&
            this.plan.team_leader.indexOf('big_employer_manager') !== -1) {
          this.plan.team_leader = ['small_and_big_managers'];
        }
        if (this.plan.id) {
          this.planService.update(this.plan)
            .then(response => this.handleResponse(response));
        } else {
          this.planService.create(this.plan)
            .then(response => this.handleResponse(response));
        }

    }
  }

  private handleResponse(response: string): void {
    if (response['message'] === 'success') {
      this.previous();
    } else {
      this.notificationService.error(response);
    }
  }

  previous(): void {
    this._location.back();
  }

  validationsDate(start_time, end_time): boolean {
    const date_start_time = new Date(this.date  + start_time);
    const date_end_time = new Date(this.date + end_time);
    if (date_start_time.getTime() > date_end_time.getTime()) {
      return true;
    }
  }

}
