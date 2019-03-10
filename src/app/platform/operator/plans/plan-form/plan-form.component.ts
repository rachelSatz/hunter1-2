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

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.css']
})
export class PlanFormComponent implements OnInit, OnDestroy  {
  plan = new Plan();
  types = Object.keys(PlanTypeLabel).map(function(e) {
    return { id: e, name: PlanTypeLabel[e] };
  });
  operators: User[] = [];
  timestamps = [];
  taskCategories: TimerType[] = [];
  isSubmitFailed = false;
  isSubmitting = false;
  sub: Subscription;
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
    if (this.plan != null && this.plan.user_plan.length > 0) {
      this.operators = this.plan.user_plan;
    } else {
      this.userService.getUsers().then(response => this.operators = response);
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
        this.planService.updatePlan(this.plan, this.categoriesData).then(response => {
          if (response) {
          } else {
          }
        });
      } else {
        this.planService.newPlan(this.plan, this.categoriesData).then(response => {
          if (response) {

          } else {
          }
        });
      }
  }
  ngOnDestroy(): void {
  }

}
