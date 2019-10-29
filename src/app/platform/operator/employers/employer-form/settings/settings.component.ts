import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { Employer } from 'app/shared/_models/employer.model';
import { UserPermissionService } from 'app/shared/_services/user-permission.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  isMyHr: boolean;
  comment: string;
  employerId: number;
  employer: Employer;
  role = this.userSession.getRole() !== 'employer';


  constructor( private route: ActivatedRoute,
               private employerService: EmployerService,
               private userSession: UserSessionService,
               protected notificationService: NotificationService) { }

  ngOnInit() {
    this.employer =  this.route.parent.snapshot.parent.data['employer'];
    this.employerId = this.employer['id'];
    this.isMyHr = this.employer['is_myhr'];
    this.comment =  this.employer['comment_broadcast'];
  }

  submit(form): void {
    this.employerService.updateMonthlyReports(form.value, this.employerId ).then( response => {
      if ( response === 'Success') {
        this.employer['is_myhr'] = this.isMyHr;
        this.employer['comment_broadcast'] = this.comment;
        this.notificationService.success('נשמר בהצלחה');
      }else {
        this.notificationService.success( 'שגיאה');
      }
    });
  }

}
