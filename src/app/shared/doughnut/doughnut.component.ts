import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.css']
})
export class DoughnutComponent implements OnInit {
  public doughnutChartLabels = ['ללא אפסים', 'אפסים'];
  public doughnutChartData = [0, 0];
  public doughnutChartType = 'doughnut';

  constructor() { }

  ngOnInit() {
  }
}
