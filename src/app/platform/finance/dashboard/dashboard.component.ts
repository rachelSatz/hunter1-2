import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { InvoiceService} from '../../../shared/_services/http/invoice.service';
import { NotificationService} from '../../../shared/_services/notification.service';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public chartType = 'doughnut';
  public chartDatasets: Array<any> = [
    { data: [300, 50, 100, 40, 120], label: 'My First dataset' }
  ];
  public chartLabels: Array<any> = ['Red', 'Green', 'Yellow', 'Grey', 'Dark Grey'];
  public chartColors: Array<any> = [
    {
      backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
      hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774'],
      borderWidth: 2,
    }
  ];

  organizations = [];
  employers = [];



  constructor(route: ActivatedRoute,
              private invoiceService: InvoiceService,
              protected notificationService: NotificationService,
              public selectUnitService: SelectUnitService) { }

  ngOnInit() {

  }

  submit(form: NgForm): void {
    const organizationId = this.selectUnitService.currentOrganizationID;
    const employerId = this.selectUnitService.currentEmployerID;
    const departmentId = this.selectUnitService.currentDepartmentID;

    // if (form.value['redirectedId'] !== '') {
    //   this.productService.addRedirectedProduct(form.value['redirectedId'], this.data.productId).then(response => {
    //     if (response === 'Success!') {
    //       this.dialogRef.close();
    //     } else {
    //       this.notificationService.error('', response);
    //     }
    //   });
    // }
  }
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }
}
