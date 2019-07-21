import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Plan } from 'app/shared/_models/plan';
import { PlanService } from 'app/shared/_services/http/plan.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
})
export class PlansComponent implements OnInit {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  plans: any;

  readonly columns = [
    { name: 'name', label: 'שם התוכנית' , searchable: false},
    { name: null, label: 'זמן התוכנית' , searchable: false},
    { name: 'status', label: 'סטטוס' , searchable: false}
  ];

  constructor(private planService: PlanService,
              protected route: ActivatedRoute,
              protected notificationService: NotificationService) {
  }

  ngOnInit() {
    this.planService.getPlans(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
      this.plans = response;
    });
  }

  activatePlan(plan: Plan): void {
    this.planService.activatePlan(plan).then(res =>
      this.notificationService.info(res['message']));
  }
}
