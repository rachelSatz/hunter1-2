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
  styles: ['#styleFormat { height: 200px; padding-top: 20px; margin: auto; }'],
  animations: [ fade ]
})
export class ProactiveInvoiceFormComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  employers: any;
  message: string;
  invoice: string;
  hasServerError = false;
  employer_id: number;
  projects = [];
  projectIds = [];
  conditions = {};
  payment_method;
  paymentMethodItems = Object.keys(PAYMENT_METHOD).map(function(e) {
    return { id: e, name: PAYMENT_METHOD[e] };
  });
  is_submitted = false;

  constructor( private helpers: HelpersService,
               private route: ActivatedRoute,
               private router: Router,
               private invoiceService: InvoiceService,
               private employerService: EmployerService,  private selectUnit: SelectUnitService,
               private notificationService: NotificationService,
               private dialogRef: MatDialogRef<ProactiveInvoiceFormComponent>,
               private generalService: GeneralService) { }

  ngOnInit() {
    this.employerService.getPayEmployers().then(
      response =>  {
        this.employers = response['data'];
        this.employers.push({'id': '0', 'name': 'כלל המעסיקים'});
        this.employers.sort((a, b) => a.id - b.id);
      });
    this.generalService.getProjects(this.selectUnit.getProjectGroupId()).then(response => this.projects = response['data']);
  }

  submit(form: NgForm): void {
    console.log(form.submitted);
    if (form.valid) {
      this.hasServerError = false;
      this.helpers.setPageSpinner(true);
      this.conditions = {};
      this.conditions['for_month'] = form.value.for_month;
      if (this.employer_id && +this.employer_id > 0) {
         this.conditions['employer_id'] = +this.employer_id;
      }
      if (this.projectIds.length > 0) {
        this.conditions['project_ids'] = this.projectIds;
      }
      if (this.payment_method) {
        this.conditions['payment_method'] = this.payment_method;
      }
      this.invoiceService.createProactiveInvoice(this.conditions).then(response => {
        this.helpers.setPageSpinner(false);
        this.employer_id = this.payment_method = null;
        this.projectIds = [];
        if (response['message'] === 'no employers to charged') {
          this.notificationService.info('לא בוצע חיוב');
        } else if (response['message'] === 'success') {
          this.notificationService.success('חיוב בוצע בהצלחה', 'הופקו ' + response['count_invoices'] + ' חשבוניות ');
        } else {
          this.notificationService.error( 'ארעה שגיאה ' + 'הופקו '  + response['count_invoices'] + ' חשבוניות ');
        }
      });
     } else {
      this.is_submitted = true;
    }
  }

}
