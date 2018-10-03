import { Component, OnInit, Input } from '@angular/core';
import { BarChartDataItem } from "../../../shared/_models/BarChartDataItem.model";
import { MONTHS } from "../../../shared/_const/months";
import { EmployeeFeedback } from "../../../shared/_models/employee-feedback.model";
import { EmployerService } from "../../../shared/_services/http/employer.service";
import { GeneralHttpService } from "../../../shared/_services/http/general-http.service";
import { Employer } from "../../../shared/_models/employer.model";
import { ServiceDashboardService } from "../../../shared/_services/service-dashboard.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-app-feedback-graph-only',
  templateUrl: './app-feedback-graph-only.component.html',
  styleUrls: ['./app-feedback-graph-only.component.css']
})
export class AppFeedbackGraphOnlyComponent implements OnInit {

  @Input() graphOnly = false;
  subscription: Subscription;
  constructor(private employerService: EmployerService, private generalService: GeneralHttpService, public dashboardService: ServiceDashboardService) {

  }

  feedback = new EmployeeFeedback();

  employers: Employer[] = [];

  readonly months = MONTHS;
  readonly currentYear = new Date().getFullYear();
  readonly currentMonth = new Date().getMonth() + 1;
  searchCriteria = { employerId: 0, year: this.currentYear, months: [this.currentMonth] };

  chartOptions = {};

  chartData: { data: number[], label: string }[] = [];
  chartLabels: string[] = [];

  chartDataReady = false;

  readonly chartColors = [

    {
      backgroundColor: 'rgba(87, 189, 190, 1)'
    },
    {
      backgroundColor: 'rgba(249, 197, 135, 1)'
    },
    {
      backgroundColor: 'rgba(251, 103, 131, 1)'
    },

  ];

  ngOnInit() {

    this.dashboardService.isChangeSelect.subscribe(
      () => {
        console.log("dashboardService.isChangeSelect");

        this.generalService.getBarChartData(this.dashboardService.getSelect()).then(response => this.setChartData(response));
      });
    this.chartOptions = {
      scaleShowVerticalLines: false,
      responsive: true,
      scales: {
        xAxes: [{
          stacked: true,
          ticks: {
            display: !this.graphOnly,
            autoSkip: this.graphOnly ? true : false
          }
        }
        ],
        yAxes: [{
          stacked: true
        }]
      },
      legend: {
        position: 'bottom'
      }
    };
    this.getBarChartData();

  }

  private getBarChartData(): void {
    if (this.searchCriteria.months.length === 0) {
      delete this.searchCriteria.months;
    }

    this.generalService.getBarChartData(this.searchCriteria).then(response => this.setChartData(response));
  }

  setChartData(response: BarChartDataItem[]): void {

    this.chartDataReady = false;



    this.chartData = [];
    this.chartLabels = [];

    const unpaidArr: number[] = [];
    const paidArr: number[] = [];
    const fullyPaidArr: number[] = [];
    let Numunpaid = 0;
    let Numpaid = 0;
    let NumfullyPaid = 0;
    if (response.length === 0) {
      this.chartData.push({ data: fullyPaidArr, label: 'נפרעו' });
      this.chartData.push({ data: paidArr, label: 'נפרעו חלקית' });
      this.chartData.push({ data: unpaidArr, label: 'לא נפרעו' });
      this.chartDataReady = true;
      return;
    }

    for (const i of response) {
     Numunpaid += i.unpaid;
     Numpaid += i.paid;
     NumfullyPaid += i.fullyPaid;
    }
      unpaidArr.push(Numunpaid);
      paidArr.push(Numpaid);
      fullyPaidArr.push(NumfullyPaid);
    this.chartLabels.push(this.months[this.searchCriteria.months[0]]);
    this.chartData.push({ data: fullyPaidArr, label: 'נפרעו' });
    this.chartData.push({ data: paidArr, label: 'נפרעו חלקית' });
    this.chartData.push({ data: unpaidArr, label: 'לא נפרעו' });
    this.chartDataReady = true;
  }
  /*
    setMonths(values: number[]): void {
  
      this.searchCriteria.months = [];
      if (values.findIndex(x => x === 0) !== -1) {
  
        for (let i = 0; i <= 12; i++) {
          this.searchCriteria.months.push(i);
        }
  
      } else {
        for (const i of values) {
          this.searchCriteria.months.push(i);
        }
      }
  
      this.getBarChartData();
    }
  
    setEmployer(id: number): void {
      this.searchCriteria.employerId = id;
      this.getBarChartData();
    }
  
    setYear(year: number): void {
      this.searchCriteria.year = year;
      this.getBarChartData();
    }*/

  chartClicked(e: { event: MouseEvent, active: any[] }): void {
    let sectionClicked;

    const yCords = [];

    for (let i = 0; i < e.active.length; i++) {
      yCords[e.active[i]._model.y] = e.active[i]._model.datasetLabel;
    }

    for (const i in yCords) {
      if (e.event.offsetY >= +i) {
        sectionClicked = yCords[i];
      }
    }

    const status = this.feedback.getStatusLabels(sectionClicked, 'value');
    const company = e.active[0]._model.label;

    /*this.router.navigate(['/feedback/table/employees'], { queryParams: {
      employer: this.searchCriteria.employerId,
      year: this.searchCriteria.year,
      months: JSON.stringify(this.searchCriteria.months),
      status: status,
      company: company
    }
    });*/
  }
}
