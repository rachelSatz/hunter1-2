import { NgForm } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router} from '@angular/router';
import { Component, OnDestroy, OnInit} from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { Categories, Plan, PlanCategoryLabel, TIMESTAMPS } from 'app/shared/_models/plan';
import { NotificationService } from 'app/shared/_services/notification.service';
import { TaskService} from 'app/shared/_services/http/task.service';
import { PlanService} from 'app/shared/_services/http/plan.service';
import { UserService} from 'app/shared/_services/http/user.service';
import { User} from 'app/shared/_models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.css']
})
export class PlanFormComponent implements OnInit, OnDestroy  {
  plan = new Plan;
  // types = Object.keys(PlanTypeLabel).map(function(e) {
  //   return { id: e, name: PlanTypeLabel[e] };
  // });
  types = [];
  subTypes = [];
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
  constructor(private router: Router,
              private route: ActivatedRoute,
              private taskService: TaskService,
              private planService: PlanService,
              private userService: UserService,
              public datePipe: DatePipe,
              protected notificationService: NotificationService,
              private _location: Location) { }

  ngOnInit() {
    this.timestamps = TIMESTAMPS;
    if (this.route.snapshot.data.plan) {
      this.plan = this.route.snapshot.data.plan;
    }
    this.userService.usersList().then(response => this.operators = response['items']);
    this.planService.getTypes().then(response => this.types = response);
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
    this.plan.categories.push(new Categories());
  }

  deletePlanRow(index: number): void {
    this.plan.categories.splice(index, 1);
  }

  selectedSubType(typeId: number): void {
    this.subTypes = this.types.find(a => a.id === typeId).subtypes;
    if (this.subTypes !== null) {

    }
  }

  submit(form: NgForm): void {
    if (form.valid) {
      this.plan.categories.forEach(item => {
        item.salary_date_start = this.datePipe.transform(item.salary_date_start, 'yyyy-MM-dd');
        item.salary_date_end = this.datePipe.transform(item.salary_date_end, 'yyyy-MM-dd');
      });
      // this.plan.salary_start_date = this.datePipe.transform(this.plan.salary_start_date, 'yyyy-MM-dd');
      // this.plan.salary_end_date = this.datePipe.transform(this.plan.salary_end_date, 'yyyy-MM-dd');
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

  ngOnDestroy(): void {
  }

}
