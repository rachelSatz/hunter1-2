import { Component, OnInit, ViewChild} from '@angular/core';
import { DataTableComponent } from 'app/shared/data-table-1/data-table.component';
import { ActivatedRoute } from '@angular/router';
import { PlanService } from '../../../shared/_services/http/plan.service';
import { Plan } from '../../../shared/_models/plan';
import {NotificationService} from '../../../shared/_services/notification.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', './plans.component.css']
})
export class PlansComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  savedPlan: string;
  plans: any;

  readonly columns = [
    { name: 'name', label: 'שם התוכנית' , searchable: false},
    { name: null, label: 'זמן התוכנית' , searchable: false},
    { name: null, label: 'חודשי שכר התוכנית' , searchable: false},
    { name: 'status', label: 'סטטוס' , searchable: false}
  ];

  constructor(private planService: PlanService,
              protected route: ActivatedRoute,
              protected notificationService: NotificationService) {
  }


  ngOnInit() {
    this.planService.getPlans().then(response => {
      this.dataTable.setItems(response);
      this.plans = response;
    });
  }
  activatePlan(plan: Plan): void {
    this.planService.activatePlan(plan).then(res => this.notificationService.info(res));

  }
}
