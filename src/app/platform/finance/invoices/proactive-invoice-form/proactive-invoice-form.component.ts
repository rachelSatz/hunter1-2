import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from '../../../../shared/data-table/data-table.component';
import { PAYMENT_METHOD } from '../../../../shared/_models/employer-financial-details.model';
import { MatDialogRef } from '@angular/material';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../../../shared/_services/http/invoice.service';
import { EmployerService } from '../../../../shared/_services/http/employer.service';
import { SelectUnitService } from '../../../../shared/_services/select-unit.service';
import { NotificationService } from '../../../../shared/_services/notification.service';
import { GeneralService } from '../../../../shared/_services/http/general.service';
import { fade } from '../../../../shared/_animations/animation';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-proactive-invoice-form',
  templateUrl: './proactive-invoice-form.component.html',
  styleUrls: ['./proactive-invoice-form.component.css'],
  styles: ['#styleFormat { height: 200px; padding-top: 20px; margin: auto; }'],
  animations: [ fade ]
})
export class ProactiveInvoiceFormComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  employers: any;
  message: string;
  invoice: string;
  hasServerError = false;
  projects = [];
  conditions = {}
  paymentMethodItems = Object.keys(PAYMENT_METHOD).map(function(e) {
    return { id: e, name: PAYMENT_METHOD[e] };
  });

  constructor( private helpers: HelpersService,
               private route: ActivatedRoute,
               private router: Router,
               private invoiceService: InvoiceService,
               private employerService: EmployerService,  private selectUnit: SelectUnitService,
               private notificationService: NotificationService,
               private dialogRef: MatDialogRef<ProactiveInvoiceFormComponent>,
               private GeneralService: GeneralService) { }

  ngOnInit() {
    this.employerService.getEmployers().then(
      response =>  {
        this.employers = response['data'];
        this.employers.push({'id': '0', 'name': 'כלל המעסיקים'});
        this.employers.sort((a, b) => a.id - b.id);
      });
    this.GeneralService.getProjects(this.selectUnit.getProjectGroupId()).then(response => this.projects = response['data']);
  }
  submit(form: NgForm): void {
    if (form.valid) {
      console.log(form);
      this.hasServerError = false;
      this.helpers.setPageSpinner(true);
      this.conditions['for_month'] = form.value.for_month;
      console.log(this.conditions['for_month']);
      if (form.value['employer_id'] && +form.value['employer_id'] > 0) {
         this.conditions['employer_id'] = +form.value['employer_id'];
      }
      if (form.value['project_id'] && +form.value['project_id'] > 0) {
        this.conditions['project_id'] = +form.value['project_id'];
      }
      if (form.value['payment_method']) {
        this.conditions['payment_method'] = form.value['payment_method'];
      }
      this.invoiceService.createProactiveInvoice(this.conditions).then(response => {
        console.log(response);
      });



     }
  }

}
