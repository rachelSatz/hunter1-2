import { Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { TaskService} from 'app/shared/_services/http/task.service';
import { PlanService} from 'app/shared/_services/http/plan.service';
import { User} from 'app/shared/_models/user.model';
import {Plan, PlanCategoryLabel, PlanRow, PlanType, PlanTypeLabel, TimerType, TIMESTAMPS} from '../../../../shared/_models/plan';
import { Subscription} from 'rxjs';
import { UserService} from '../../../../shared/_services/http/user.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList } from '@angular/cdk/drag-drop';
import {FormControl, NgForm} from '@angular/forms';
import {DatePipe, Time} from '@angular/common';
import {NotificationService} from '../../../../shared/_services/notification.service';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.css']
})
export class PlanFormComponent implements OnInit, OnDestroy  {
  plan = new Plan;
  types = Object.keys(PlanTypeLabel).map(function(e) {
    return { id: e, name: PlanTypeLabel[e] };
  });
  operators: User[] = [];
  timestamps = [];
  isSubmitFailed = false;
  isSubmitting = false;
  sub: Subscription;
  showLabel = false;
  categoryLabel = PlanCategoryLabel;
  planCategories = Object.keys(PlanCategoryLabel).map(function(e) {
    return { id: e, name: PlanCategoryLabel[e] };
  });
  categoriesData = [];
  constructor(private router: Router, private route: ActivatedRoute,
              private taskService: TaskService, private planService: PlanService,
              private userService: UserService,
              public datePipe: DatePipe,
              protected notificationService: NotificationService) { }

  ngOnInit() {
    this.timestamps = TIMESTAMPS;
    if (this.route.snapshot.data.plan) {
      this.plan = this.route.snapshot.data.plan;
    }
    this.userService.usersList().then(response => this.operators = response['items']);
    // this.plan.user_plan = Object.keys(this.plan.user_plan).map(key => ( {key: 'id'}));
    // if (this.plan.plan_category.length > 0) {
    //   this.categoriesData = this.plan.plan_category;
    //   this.categoriesData.sort((a, b) => a.id - b.id);
    //   this.showLabel = true;
    // } else {
    //   this.categoriesData = this.planCategories;
    // }
  }
  // checktime(start: string , end: string): boolean {
  //   const startTime = +start;
  //   const endTime = +end;
  //   if (startTime > endTime) {
  //     return false;
  //   }
  //   return true;
  // }

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


  addPlanRow(): void {
    this.plan.planRows.push(new PlanRow());
  }

  deletePlanRow(index: number): void {
    this.plan.planRows.splice(index, 1);
  }

  submit(form: NgForm): void {
    if (form.valid) {
      if (this.categoriesData.length === 0) {
        this.categoriesData = this.planCategories;
      }
      // this.plan.salary_start_date = this.datePipe.transform(this.plan.salary_start_date, 'yyyy-MM-dd');
      // this.plan.salary_end_date = this.datePipe.transform(this.plan.salary_end_date, 'yyyy-MM-dd');
      if (this.plan.id) {
        this.planService.update(this.plan, this.categoriesData)
          .then(response => this.handleResponse(response));
      } else {
        this.planService.create(this.plan, this.categoriesData)
          .then(response => this.handleResponse(response));
      }
    }
  }

  private handleResponse(response: string): void {
    if (response['message'] === 'success') {
      this.router.navigate(['platform', 'operator', 'plans']);
    } else {
      this.notificationService.error(response);
    }
  }

  back(): void {
    this.router.navigate(['platform', 'operator', 'plans']);
  }

  ngOnDestroy(): void {
  }

}
