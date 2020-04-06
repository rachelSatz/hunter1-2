import { Component, OnInit } from '@angular/core';

import { EmployerService } from 'app/shared/_services/http/employer.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { ActivatedRoute } from '@angular/router';
import { Employer } from 'app/shared/_models/employer.model';
import { AddEmailComponent } from './add-email/add-email.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  month = [];
  type = 'report';
  role = this.userSession.getRole() !== 'employer';
  employer: Employer;


  constructor( private route: ActivatedRoute,
               private employerService: EmployerService,
               private selectUnit: SelectUnitService,
               private dialog: MatDialog,
               private userSession: UserSessionService,
               protected notificationService: NotificationService) { }

  ngOnInit() {
    for (let i = 0; i < 31; i++) {
      this.month[i] = i + 1;
    }
    this.employer = this.route.parent.snapshot.parent.data['employer'];
  }

  addEmailToEmployer(): void {
    this.dialog.open(AddEmailComponent, {
      data : {employerId : this.employer.id},
      width: '550px',
      height: '500px'
    });

  }

  submit(form) {
    this.employerService.updateMonthlyReports(form.value, this.selectUnit.currentEmployerID).then( response => {
      if ( response === 'Success') {
        this.notificationService.success('נשמר בהצלחה');
      }else {
        this.notificationService.success( 'שגיאה');
      }
    });
  }
}
