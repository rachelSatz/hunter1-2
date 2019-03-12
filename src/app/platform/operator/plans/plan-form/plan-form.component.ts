import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskService} from '../../../../shared/_services/http/task.service';
import {PlanService} from '../../../../shared/_services/http/plan.service';
import {User} from '../../../../shared/_models/user.model';
import {Plan, PlanCategoryLabel, PlanType, PlanTypeLabel, TimerType, TIMESTAMPS} from '../../../../shared/_models/plan';
import {Subscription} from 'rxjs';
import {Status} from '../../../../shared/_models/file-feedback.model';
import {UserService} from '../../../../shared/_services/http/user.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList} from '@angular/cdk/drag-drop';
import {BankAccount} from '../../../../shared/_models/bank.model';
import {Type} from '../../../../shared/_models/contact.model';
import {FormControl} from '@angular/forms';
import {forEach} from '@angular/router/src/utils/collection';

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
  toppings = new FormControl();
  test: string;
  operators: User[] = [];
  operatorsList = []
  timestamps = [];
  taskCategories: TimerType[] = [];
  isSubmitFailed = false;
  isSubmitting = false;
  sub: Subscription;
  showLabel = false
  categoryLabel = PlanCategoryLabel;
  planCategories = Object.keys(PlanCategoryLabel).map(function(e) {
    return { id: e, name: PlanCategoryLabel[e] };
  });
  categoriesData = [];

  constructor(private router: Router, private route: ActivatedRoute,
              private taskService: TaskService, private planService: PlanService,
              private userService: UserService) { }

  ngOnInit() {
    this.timestamps = TIMESTAMPS;
    if (this.route.snapshot.data.plan) {
      this.plan = this.route.snapshot.data.plan;
    }
    this.userService.getUsers().then(response => this.operators = response);
    this.toppings.setValue(this.plan.user_plan);
    console.log(this.toppings)
    if (this.plan.plan_category.length > 0) {
      this.categoriesData = this.plan.plan_category;
      this.showLabel = true;
    } else {
      this.categoriesData = this.planCategories;
    }
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

  submit(isValid: boolean): void {
    if (this.categoriesData.length === 0) {
      this.categoriesData = this.planCategories;
    }
    if (this.plan.id) {
        this.planService.update(this.plan, this.categoriesData).then(response => {
          if (response) {
          } else {
          }
        });
      } else {
        this.planService.create(this.plan, this.categoriesData).then(response => {
          if (response) {

          } else {
          }
        });
      }
  }
  ngOnDestroy(): void {
  }

}
