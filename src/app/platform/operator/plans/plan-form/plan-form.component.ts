import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskService} from '../../../../shared/_services/http/task.service';
import {PlanService} from '../../../../shared/_services/http/plan.service';
import {User} from '../../../../shared/_models/user.model';
import {Plan, PlanType, TimerType, TIMESTAMPS} from '../../../../shared/_models/plan';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.css']
})
export class PlanFormComponent implements OnInit, OnDestroy  {
  plan = new Plan();
  types: PlanType[] = [];
  operators: User[] = [];

  timestamps = [];

  taskCategories: TimerType[] = [];

  isSubmitFailed = false;
  isSubmitting = false;

  sub: Subscription;
  constructor(private router: Router, private route: ActivatedRoute,
              private taskService: TaskService, private planService: PlanService) { }

  ngOnInit() {
    this.timestamps = TIMESTAMPS;
  }

  ngOnDestroy(): void {
  }

}
