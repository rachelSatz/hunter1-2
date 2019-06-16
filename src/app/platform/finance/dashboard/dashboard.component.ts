import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { InvoiceService} from '../../../shared/_services/http/invoice.service';
import { NotificationService} from '../../../shared/_services/notification.service';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';
import {NgForm} from '@angular/forms';
import {EmployerService} from '../../../shared/_services/http/employer.service';
import {PRODUCT_TYPES} from '../../../shared/_models/employer-financial-details.model';
import {DoughnutComponent} from '../../../shared/doughnut/doughnut.component';
import * as FileSaver from 'file-saver';

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
  spin: boolean;
  fileName: string;
  data: any;
  zeroCount = 0;
  notZeroCount = 0;

  constructor(route: ActivatedRoute,
              private invoiceService: InvoiceService,
              protected notificationService: NotificationService,
              public selectUnitService: SelectUnitService,
              public employerService: EmployerService) {
  }

  ngOnInit() {
  }


  downloadExcelDashboard(onlyZero: boolean): void {
    if ((onlyZero && this.zeroCount === 0) || (!onlyZero && this.notZeroCount === 0 && this.zeroCount === 0))  {
      this.notificationService.info('אין נתונים להורדה');
    } else if (this.data !== undefined) {
      this.invoiceService.downloadExcelFinanceDashboard(onlyZero, this.data).then(response => {
        if (response['message'] !== 'error') {
          const byteCharacters = atob(response['message']['data']);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {type: 'application/' + 'xlsx'});
          if (onlyZero) {
            this.fileName = 'דו"ח אפסים';
          } else {
            this.fileName = 'דו"ח כולל אפסים';
          }
           const fileName = 'סטטוס מעסיקים-' + this.fileName + '.xlsx';
          FileSaver.saveAs(blob, fileName);
          this.spin = false;
          this.notificationService.success('הקובץ הופק בהצלחה');
        } else {
          this.notificationService.info('ארעה שגיאה');
        }
      });
    } else {
      this.notificationService.info('יש לבצע חיפוש תחילה');
    }
  }

  submit(form: NgForm): void {
    if (form.valid) {
      const organizationId = this.selectUnitService.currentOrganizationID;
      const employerId = this.selectUnitService.currentEmployerID;
      const departmentId = this.selectUnitService.currentDepartmentID;
      this.data = {organizationId: organizationId,
          employerId: employerId, departmentId: departmentId,
          forMonth: form.value['for_month'], productType: form.value['product_type']};
      this.employerService.getEmployersDashboard(this.data).then(response => {
        if (response['message'] === 'success') {
          this.zeroCount = response['zero_count'];
          this.notZeroCount = response['not_zero_count'];
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
