import { Component, OnInit } from '@angular/core';
import {GeneralService} from '../../shared/_services/http/general.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  projects = [];
  projectId: number;
  timeRange = [{id: 1, name: 'לפי חודש'}, {id: 2, name: 'לפי תקופה'}];
  timeRangeId: number = 1;
  month: Date;
  fromDate: Date;
  toDate: Date;
  ifByMonth: boolean = true;

  constructor(private GeneralService: GeneralService) {
  }

  ngOnInit() {
    this.fetchItems();
  }

  fetchItems(): void {
    this.GeneralService.getProjects(1)
      .then(response => this.projects = response[('1')]);
  }

  filterData(): void {
    console.log(this.projectId);
    console.log(this.timeRangeId);
    console.log(this.month);
    console.log(this.fromDate);
    console.log(this.toDate);
    if (this.timeRangeId === 2)
      this.ifByMonth = false;
    this.GeneralService.get_financial_data(this.projectId, this.ifByMonth, this.month, this.fromDate, this.toDate)
      .then(response => console.log(response))
  }
}
