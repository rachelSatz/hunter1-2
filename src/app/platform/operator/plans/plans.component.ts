import { Component, OnInit } from '@angular/core';
import {DataTableComponent} from '../../../shared/data-table/data-table.component';
import {ActivatedRoute} from '@angular/router';
import {PlanService} from '../../../shared/_services/http/plan.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent extends DataTableComponent implements OnInit {

  savedPlan: string;

  readonly headers = [
    { column: 'name', label: 'שם התוכנית' }, { column: null, label: 'זמן התוכנית' },
    { column: null, label: 'חודשי שכר התוכנית' }, { column: 'status', label: 'סטטוס' }
  ];

  constructor(private planService: PlanService, protected route: ActivatedRoute) {
    super(route);
  }


  ngOnInit() {
  }

}
