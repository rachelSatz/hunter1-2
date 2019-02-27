import { Component, OnInit } from '@angular/core';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { User } from 'app/shared/_models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: User;


  readonly chartData = {
    options: {
      legend: {
        position: 'bottom',
      },
      responsive: true
    },
    values: [
      { label: 'לא נפרע', data: [150] }, { label: 'נפרע', data: [220] }, { label: 'נפרע', data: [330] }
    ]};

  stats = [
    { 'title': 'סה"כ עובדים', 'image': 'group', value: 0 }, { 'title': 'פניות פתוחות', 'image': 'text_bubbles', value: 0 },
    { 'title': 'כספים ששולמו', 'image': 'coins', value: 0 }, { 'title': 'קבצים ששודרו', 'image': 'folder', value: 0 }
  ];

  constructor(private userSession: UserSessionService) { }

  ngOnInit() {
    this.user = this.userSession.getUser();

  }




}
