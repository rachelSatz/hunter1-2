import { Component, OnInit, ViewChild} from '@angular/core';
import { SelectUnitService } from '../../../shared/_services/select-unit.service';
import { ActivatedRoute } from '@angular/router';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { InvoiceService } from 'app/shared/_services/http/invoice.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { DoughnutComponent } from 'app/shared/doughnut/doughnut.component';
import { PRODUCT_TYPES } from 'app/shared/_models/employer-financial-details.model';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-employers-id-display',
  templateUrl: './employers-id-display.component.html',
  styleUrls: ['./employers-id-display.component.css']
})
export class EmployersIdDisplayComponent implements OnInit {
  @ViewChild(DoughnutComponent) doughnut: DoughnutComponent;

  totalIds: number;
  organizations = [];
  employers = [];
  spin: boolean;
  fileName: string;
  data: any;
  zeroCount = 0;
  notZeroCount = 0;
  invoiceId = 0;
  test: string;
  productTypesItems = Object.keys(PRODUCT_TYPES).map(function(e) {
    return { id: e, name: PRODUCT_TYPES[e] };
  });


  constructor(private SelectUnitService: SelectUnitService,
              route: ActivatedRoute,
              private invoiceService: InvoiceService,
              protected notificationService: NotificationService,
              private helpers: HelpersService,
              public employerService: EmployerService) { }

  ngOnInit() {
    this.SelectUnitService.setActiveUrl('finance');
  }

  submit(form: NgForm): void {
    if (form.valid) {
      const employerId = this.SelectUnitService.getEmployerID();
      this.data = { forMonth: form.value['for_month'],
                    productType: form.value['product_type']};
      this.totalIds = 0;
      this.doughnut.doughnutChartData = [0, 0];
      this.employerService.getEmployerExternalByEmployerId(employerId)
        .then(res => {
          this.data['employerId'] = +res;
          this.employerService.getEmployersDashboard(this.data).then(response => {
            console.log('heiiiii');
            console.log(response);
            if (response['message'] === 'success') {
              this.zeroCount = response['zero_count'];
              this.notZeroCount = response['not_zero_count'];
              this.totalIds = response['not_zero_count'] + response['zero_count'];
              this.doughnut.doughnutChartData = [response['not_zero_count'], response['zero_count']];
            } else if (response['message'] === 'success_mtb') {
              this.zeroCount = response['zero_count'];
              this.notZeroCount = response['not_zero_count'];
              this.totalIds = response['not_zero_count'] + response['zero_count'];
              this.doughnut.doughnutChartData = [response['not_zero_count'], response['zero_count']];
              this.notificationService.info('המידע מוצג מ- mtb');
            } else if (response['message'] === 'no_data') {
              this.zeroCount = 0;
              this.notZeroCount = 0;
              this.totalIds = 0;
              this.doughnut.doughnutChartData = [0, 0];
              this.notificationService.info('לא נמצאו נתונים');
            } else {
              this.notificationService.error(response['message']);
            }
          });
        });

    }

  }

}
