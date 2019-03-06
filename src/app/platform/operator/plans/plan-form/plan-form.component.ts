import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskService} from '../../../../shared/_services/http/task.service';
import {PlanService} from '../../../../shared/_services/http/plan.service';
import {User} from '../../../../shared/_models/user.model';
import {Plan, PlanType, PlanTypeLabel, TimerType, TIMESTAMPS} from '../../../../shared/_models/plan';
import {Subscription} from 'rxjs';
import {Status} from '../../../../shared/_models/file-feedback.model';
import {UserService} from '../../../../shared/_services/http/user.service';

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
  constructor(private router: Router, private route: ActivatedRoute,
              private taskService: TaskService, private planService: PlanService,
              private userService: UserService) { }

  ngOnInit() {
    this.timestamps = TIMESTAMPS;
    this.userService.getUsers().then(response => this.operators = response);

  }

  ngOnDestroy(): void {
  }

}
