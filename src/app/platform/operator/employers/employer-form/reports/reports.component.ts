import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  month = [];

  constructor() { }

  ngOnInit() {
    for (let i = 0; i < 31; i++) {
      this.month[i] = i + 1;
    }
  }
}
