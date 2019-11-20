import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { EmployerService } from 'app/shared/_services/http/employer.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { InvoiceService } from 'app/shared/_services/http/invoice.service';
import { fade } from 'app/shared/_animations/animation';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { NotificationService} from '../../../../shared/_services/notification.service';
import { MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-proactive-invoice-form',
  templateUrl: './proactive-invoice-form.component.html',
  styles: ['#styleFormat { height: 200px; padding-top: 20px }'],
  animations: [ fade ]
})
export class ProactiveInvoiceFormComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  employers: any;
  message: string;
  invoice: string;
  hasServerError = false;

  constructor(private route: ActivatedRoute, private router: Router, private invoiceService: InvoiceService,
              private employerService: EmployerService,  private selectUnit: SelectUnitService,
              private notificationService: NotificationService,
              private dialogRef: MatDialogRef<ProactiveInvoiceFormComponent>) { }

  ngOnInit() {
    this.employerService.getAllPayEmployers().then(
      response => this.employers = response);
  }

  submit(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;
      this.invoiceService.createInvoice(form.value).then(response => {
        if (response != null) {
          if (response['message'] !== 'success') {
            this.hasServerError = true;
            this.message = response['message'];
          } else {
            this.hasServerError = false;
            this.notificationService.success('נשמר בהצלחה.');
            this.dialogRef.close();
          }
          } else {
            this.notificationService.error('');
        }

      });
    }
  }
}
