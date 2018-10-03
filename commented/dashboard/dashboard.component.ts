import { Component, OnInit, ViewEncapsulation, forwardRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { GeneralHttpService } from '../../shared/_services/http/general-http.service';
import { Employer } from '../../shared/_models/employer.model';
import { MONTHS } from '../../shared/_const/months';
import { ServiceDashboardService } from '../../shared/_services/service-dashboard.service';
import {FormControl} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment} from 'moment';

const moment =  _moment;


// See the Moment.js docs for the meaning of these formats:
// y

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [GeneralHttpService,    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}]
})
  //provide: DateAdapter, useClass: forwardRef(() => AppDateAdapter)
export class DashboardComponent implements OnInit {





  doughnutGraph = {
    data: [100, 0, 0],
    labels: ['נפרע', 'נפרע חלקית', 'לא נפרע'],
    colors: [{
      backgroundColor: ['rgba(66, 167, 239, 1)', 'rgba(204, 204, 200, 1)', 'rgba(243, 8, 8,1)']
    }]
  };

  employers: Employer[] = [];
  selectedEmployer: Employer;
  Repaymentpercentages = 0;
  readonly months = MONTHS;

  year: string;
  month: string;
  date = new FormControl(moment().add(-1, 'M'));
  searchCriteria = {};
  countsData = {
    numberEmp: 0,
    numberRef: 0,
    totalNumberRef: 0,
    paidMoney: 0,
    numberSentFiles: 0,
    paidsCount: []
  };

  constructor(private route: ActivatedRoute, private generalService: GeneralHttpService, private router: Router,
    public dashboardService: ServiceDashboardService) { }

  ngOnInit() {
 
    console.log('date', this.date);
    debugger;
    this.employers = this.route.snapshot.data['employers'];
    this.GetemployerID();
    


     this.fetchData();
     
  }
  private GetemployerID(){
           let id = sessionStorage.getItem('EmployerID');
          if (id == "0" &&this.employers.length > 0) {
            this.selectedEmployer = this.employers[0];
          }
          else if (id) {
  
            this.selectedEmployer = this.employers.find(x => x.id.toString() === id);
          }
          else if (this.employers.length > 0) {
  
            this.selectedEmployer = this.employers[0];
          }
  }
  fetchData(): void {
    debugger;
    this.searchCriteria['employerId'] = this.selectedEmployer.id;
    this.searchCriteria['month'] = this.date.value.month() + 1;
    this.searchCriteria['year'] = this.date.value.year();

    this.generalService.getDashboardCounts(this.searchCriteria)
      .then(response => {

        if (response.Success === 1) {
          console.log('response.Data', response.Data);
          this.countsData = response.Data;
          this.doughnutGraph.data = this.countsData.paidsCount;

         /* this.countsData.paidsCount.forEach(function (value) {

            Total = Total + value;
          });
          if (Total > 0) {
            console.log("Total", Total);
            console.log("this.countsData.paidsCount[0]", this.countsData.paidsCount[0]);
            this.Repaymentpercentages = this.precisionRound((this.countsData.paidsCount[0] / Total) * 100, 2);
          }
          else {
            this.Repaymentpercentages = 0;
            this.doughnutGraph = {
              data: [100, 0, 0],
              labels: ['נפרע', 'נפרע חלקית', 'לא נפרע'],
              colors: [{
                backgroundColor: ['rgba(66, 167, 239, 1)', 'rgba(204, 204, 200, 1)', 'rgba(243, 8, 8,1)']
              }]
            };
          }*/

        }
        else {
          console.log('else');

          this.doughnutGraph.data = this.doughnutGraph.data;
          this.Repaymentpercentages = 0;
        }
      });
  }
  precisionRound(number, precision) {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }
  setDate(): void {
    this.fetchData();
    this.dashboardService.SetSelect(this.selectedEmployer.id, this.date.value.year(), this.date.value.month() + 1);
  }
  GetNewProcess(notSend: Boolean) {
    if (notSend) {
      this.router.navigate(['/process', 'table'],
        <NavigationExtras>{ queryParams: { notSend: notSend }});
      
    }
    else {
       this.router.navigate(['/process', 'table'],
        <NavigationExtras>{ queryParams: { newProcess: true }});
    }

  }
  setEmployer(employer: Employer): void {

     debugger;
    this.selectedEmployer = employer;
    this.fetchData();
    console.log('setEmployer', employer.id);
    this.dashboardService.SetSelect(this.selectedEmployer.id, this.date.value.year(), this.date.value.month() + 1);
  }
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    console.log('datechosenYearHandler', this.date);
  }

  chosenMonthHandler(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normlizedMonth.month());
    this.date.setValue(ctrlValue);
    console.log('datechosenMonthHandler', this.date);
    this.setDate();
    datepicker.close();
  }
}
