import { Component, OnInit } from '@angular/core';
import {DataTableComponent} from '../../../shared/data-table/data-table.component';
import {ActivatedRoute} from '@angular/router';
import {PlanService} from '../../../shared/_services/http/plan.service';
import {Plan} from '../../../shared/_models/plan';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', './plans.component.css']
})
export class PlansComponent extends DataTableComponent implements OnInit {

  savedPlan: string;
  plans: Plan[];

  readonly headers = [
    { column: 'name', label: 'שם התוכנית' }, { column: null, label: 'זמן התוכנית' },
    { column: null, label: 'חודשי שכר התוכנית' }, { column: 'status', label: 'סטטוס' }
  ];

  constructor(private planService: PlanService, protected route: ActivatedRoute) {
    super(route);
  }


  ngOnInit() {
    this.planService.getPlans().then(response => {
      this.setItems(response);
      this.plans = response;
    });
  }
  activatePlan(plan: Plan): void {
    this.planService.activatePlan(plan).then(res => this.notificationService.info(res));

  }
}
