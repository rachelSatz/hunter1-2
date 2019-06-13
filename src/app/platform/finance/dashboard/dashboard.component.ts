import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { InvoiceService} from '../../../shared/_services/http/invoice.service';
import { NotificationService} from '../../../shared/_services/notification.service';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';
import {NgForm} from '@angular/forms';
import {EmployerService} from '../../../shared/_services/http/employer.service';
import {PRODUCT_TYPES} from '../../../shared/_models/employer-financial-details.model';
import {DoughnutComponent} from '../../../shared/doughnut/doughnut.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(DoughnutComponent) doughnut: DoughnutComponent;

  totalIds: number;
  organizations = [];
  employers = [];
  productTypesItems = Object.keys(PRODUCT_TYPES).map(function(e) {
    return { id: e, name: PRODUCT_TYPES[e] };
  });

  constructor(route: ActivatedRoute,
              private invoiceService: InvoiceService,
              protected notificationService: NotificationService,
              public selectUnitService: SelectUnitService,
              public employerService: EmployerService) {
  }

  ngOnInit() {
  }


  downloadExcelFinanceDashboard(isZero: boolean): void {
    this.invoiceService.downloadExcelFinanceDashboard(isZero).then(response => {
      if (response['message'] === 'success') {

      } else {

      }
    });
  }

  submit(form: NgForm): void {
    if (form.valid) {
      const organizationId = this.selectUnitService.currentOrganizationID;
      const employerId = this.selectUnitService.currentEmployerID;
      const departmentId = this.selectUnitService.currentDepartmentID;
      const data = {organizationId: organizationId,
          employerId: employerId, departmentId: departmentId,
          forMonth: form.value['for_month'], productType: form.value['product_type']};
      this.employerService.getEmployersDashboard(data).then(response => {
        if (response['message'] === 'success') {
          this.totalIds = response['not_zero_count'] + response['zero_count'];
          this.doughnut.doughnutChartData = [response['not_zero_count'], response['zero_count']];
        } else if (response['message'] === 'no_data') {
          this.notificationService.info('לא נמצאו נתונים');
        } else {
          this.notificationService.error(response['message']);
        }
      });
    }

  }
}
