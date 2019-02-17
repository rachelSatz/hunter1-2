import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../shared/_services/notification.service';
import { MatDialog } from '@angular/material';
import { SkipTaskComponent } from './skip-task/skip-task.component';

@Component({
  selector: 'app-ongoing-operation',
  templateUrl: './ongoing-operation.component.html',
  styleUrls: ['./ongoing-operation.component.css']
})
export class OngoingOperationComponent implements OnInit {
  constructor(private dialog: MatDialog,
              protected  notificationService: NotificationService) { }

  ngOnInit() {
  }
  taskCompletedDialog(): void {
    const title = 'המשימה סומנה כטופלה';
    this.notificationService.success(title);
  }

  skipTaskDialog(): void {
    this.dialog.open(SkipTaskComponent, {
      width: '1350px',
      height: '680px'
    });
  }
}
