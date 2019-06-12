import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { InvoiceService} from '../../../shared/_services/http/invoice.service';
import { NotificationService} from '../../../shared/_services/notification.service';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';
import {NgForm} from '@angular/forms';
import {EmployerService} from '../../../shared/_services/http/employer.service';
import {PRODUCT_TYPES} from '../../../shared/_models/employer-financial-details.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public chartType = 'doughnut';
  public chartDatasets: Array<any> = [
    { data: [300, 50], label: 'My First dataset' }
  ];
  public chartLabels: Array<any> = ['אפסים', 'ללא אפסים'];
  public chartColors: Array<any> = [
    {
      backgroundColor: ['#F7464A', '#46BFBD'],
      hoverBackgroundColor: ['#FF5A5E', '#5AD3D1'],
      borderWidth: 2,
    }
  ];
  public chartOptions: any = {
    responsive: true
  };
  isDataAvailable = false;

  organizations = [];
  employers = [];
  productTypesItems = Object.keys(PRODUCT_TYPES).map(function(e) {
    return { id: e, name: PRODUCT_TYPES[e] };
  });
  zero_count = 0;
  not_zero_count = 0;

  constructor(route: ActivatedRoute,
              private invoiceService: InvoiceService,
              protected notificationService: NotificationService,
              public selectUnitService: SelectUnitService,
              public employerService: EmployerService) { }

  ngOnInit() {
    // asyncFnWithCallback(()=>{ this.isDataAvailable = true});

  }

  submit(form: NgForm): void {
    if (form.valid) {
      const organizationId = this.selectUnitService.currentOrganizationID;
      const employerId = this.selectUnitService.currentEmployerID;
      const departmentId = this.selectUnitService.currentDepartmentID;
      const data = {organizationId: organizationId,
          employerId: employerId,
          departmentId: departmentId,
          forMonth: form.value['for_month'],
          productType: form.value['product_type']};
      this.employerService.getEmployersDashboard(data).then(response => {
        if (response !== null) {
          this.zero_count = response['zero_count'];
          this.not_zero_count = response['not_zero_count'];
          this.chartDatasets[0] = this.zero_count;
          this.chartDatasets[1] = this.not_zero_count;
        }
      });
      //   this.notificationService.error('', response);
    }

  }
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }
}
