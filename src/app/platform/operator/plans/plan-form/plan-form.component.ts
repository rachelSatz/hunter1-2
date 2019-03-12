import { Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { TaskService} from 'app/shared/_services/http/task.service';
import { PlanService} from 'app/shared/_services/http/plan.service';
import { User} from 'app/shared/_models/user.model';
import { Plan, PlanCategoryLabel, PlanType, PlanTypeLabel, TimerType, TIMESTAMPS } from '../../../../shared/_models/plan';
import { Subscription} from 'rxjs';
import { UserService} from '../../../../shared/_services/http/user.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList } from '@angular/cdk/drag-drop';
import {FormControl} from '@angular/forms';

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
    this.userService.usersList().then(response => this.operators = response);

    if (this.plan.plan_category.length > 0) {
      this.categoriesData = this.plan.plan_category;
      this.categoriesData.sort((a, b) => a.id - b.id);
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

  submit(): void {
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
