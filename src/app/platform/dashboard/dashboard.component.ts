import { Component, OnInit } from '@angular/core';
import {GeneralService} from '../../shared/_services/http/general.service';
import { DatePipe } from '@angular/common'


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  projects = [];
  projectId: number;
  timeRange = [{id: 1, name: 'לפי חודש'}, {id: 2, name: 'לפי תקופה'}];
  timeRangeId: number;
  month: Date;
  fromDate: Date;
  toDate: Date;
  ifByMonth: boolean = true;
  monthStr: string;
  fromDateStr: string;
  toDateStr: string;
  sum_invoices_system: number
   data: {}
  constructor(private GeneralService: GeneralService,
              public datepipe: DatePipe) {
  }

  ngOnInit() {
    this.fetchItems();


  }

  fetchItems(): void {
    this.GeneralService.getProjects(1)
      .then(response => {  this.projects = response[('1')];
                                      this.month = new Date();
                                      this.projectId = 1;
                                      this.timeRangeId = 1;
                                      this.filterData(); });
  }

  filterData(): void {
    this.monthStr = this.datepipe.transform(this.month, 'yyyy-MM-dd');
    this.fromDateStr = this.datepipe.transform(this.fromDate, 'yyyy-MM-dd');
    this.toDateStr = this.datepipe.transform(this.toDate, 'yyyy-MM-dd');
    if (this.timeRangeId === 2)
      this.ifByMonth = false;
    this.GeneralService.get_financial_data(this.projectId, this.ifByMonth, this.monthStr, this.fromDateStr, this.toDateStr)
      .then(response =>{ this.data = response['data'];
                                    console.log(this.data);
                                    this.sum_invoices_system = this.data['invoice_system']['green_invoices']['sum']+this.data['invoice_system']['green_invoices_error']} )
  }
}
