import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../shared/_services/notification.service';
import { MatDialog } from '@angular/material';
import { SkipTaskComponent } from './skip-task/skip-task.component';
import {ActivatedRoute, Router} from '@angular/router';
import {PlanService} from '../../../../shared/_services/http/plan.service';
import {PlanTask} from '../../../../shared/_models/plan-task';
import {SelectUnitService} from '../../../../shared/_services/select-unit.service';

@Component({
  selector: 'app-ongoing-operation',
  templateUrl: './ongoing-operation.component.html',
  styleUrls: ['./ongoing-operation.component.css']
})
export class OngoingOperationComponent implements OnInit {
  text: string;
  plan: PlanTask;
  constructor(protected route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              protected notificationService: NotificationService,
              private planService: PlanService,
              private selectUnitService: SelectUnitService) { }

  ngOnInit() {
    this.text = (this.route.snapshot.routeConfig.path) ? this.route.snapshot.routeConfig.path : '';
    this.planService.getSinglePlan().then(response => {
      this.plan = response['data'];
    });
  }
  taskCompletedDialog(): void {
    // const title = 'המשימה סומנה כטופלה';
    // this.notificationService.success(title);
    // const ownerType = this.plan.error.owner.type;
    const ownerType = 'records';
    if (ownerType === 'records') {
      this.router.navigate(['/platform', 'process', 'new', 1, 'details']);

    } else {

    }
    // this.plan.error.owner.id
  }

  skipTaskDialog(): void {
    this.dialog.open(SkipTaskComponent, {
      width: '660px',
      height: '240px'
    });
  }
}
