import { NgForm } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router} from '@angular/router';
import { Component, OnInit} from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { Categories, Plan, TIMESTAMPS } from 'app/shared/_models/plan';
import { NotificationService } from 'app/shared/_services/notification.service';
import { TaskService} from 'app/shared/_services/http/task.service';
import { PlanService} from 'app/shared/_services/http/plan.service';
import { UserService} from 'app/shared/_services/http/user.service';
import { User} from 'app/shared/_models/user.model';
import { Subscription } from 'rxjs';
import {IdentifierTypes} from '../../../../shared/_models/employer.model';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.css']
})
export class PlanFormComponent implements OnInit  {

  plan = new Plan;
  types = [];
  subTypes = [];
  operators: User[] = [];
  timestamps = [];
  isSubmitFailed = false;
  isSubmitting = false;
  sub: Subscription;
  categoriesData = [];
  date = '09/07/2019 ';
  group = ['צוות רעות', 'צוות סזי'];
  groups = Object.keys(IdentifierTypes).map(function(e) {
    return { id: e, name: IdentifierTypes[e] };
  });
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
    this.groups = this.group;
    this.userService.usersList().then(response => this.operators = response['items']);
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


  addPlanRow(): void {
    this.plan.categories.push(new Categories());
  }

  deletePlanRow(index: number): void {
    this.plan.categories.splice(index, 1);
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

  aaa(start_time, end_time): boolean {
    const date_start_time = new Date(this.date  + start_time);
    const date_end_time = new Date(this.date + end_time);
    if (date_start_time.getTime() > date_end_time.getTime()) {
      return true;
    }
  }

}
