import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../shared/_services/notification.service';
import { MatDialog } from '@angular/material';
import { SkipTaskComponent } from './skip-task/skip-task.component';
import { ActivatedRoute } from '@angular/router';
import {PlanService} from '../../../../shared/_services/http/plan.service';

@Component({
  selector: 'app-ongoing-operation',
  templateUrl: './ongoing-operation.component.html',
  styleUrls: ['./ongoing-operation.component.css']
})
export class OngoingOperationComponent implements OnInit {
  text: string;
  plan: any;
  constructor(protected route: ActivatedRoute, private dialog: MatDialog,
              protected  notificationService: NotificationService,
              private planService: PlanService) { }

  ngOnInit() {
    this.text = (this.route.snapshot.routeConfig.path) ? this.route.snapshot.routeConfig.path : '';
    this.planService.getSinglePlan().then(response => {
      this.plan = response;
    });
  }
  taskCompletedDialog(): void {
    const title = 'המשימה סומנה כטופלה';
    this.notificationService.success(title);
  }

  skipTaskDialog(): void {
    this.dialog.open(SkipTaskComponent, {
      width: '660px',
      height: '240px'
    });
  }
}
