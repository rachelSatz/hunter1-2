import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {fade} from '../../../../shared/_animations/animation';
import {ActivatedRoute, Router} from '@angular/router';
import {InvoiceService} from '../../../../shared/_services/http/invoice.service';
import {NotificationService} from '../../../../shared/_services/notification.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DataTableComponent} from '../../../../shared/data-table/data-table.component';
import {NgForm} from '@angular/forms';
import {DatePipe, Time} from '@angular/common';
import { HelpersService } from 'app/shared/_services/helpers.service';

@Component({
  selector: 'app-tax-invoice-form',
  templateUrl: './tax-invoice-form.component.html',
  styleUrls: ['./tax-invoice-form.component.css'],
  styles: ['#styleFormat { height: 200px; padding-top: 20px }'],
  animations: [ fade ]
})
export class TaxInvoiceFormComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  hasServerError = false;
  message: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private helpers: HelpersService,
              private route: ActivatedRoute,
              private router: Router,
              private invoiceService: InvoiceService,
              private notificationService: NotificationService,
              private dialogRef: MatDialogRef<TaxInvoiceFormComponent>,
              public datePipe: DatePipe) { }

  ngOnInit() {
  }


  submit(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;
      form.value['for_month'] = this.datePipe.transform(form.value['for_month'], 'yyyy-MM-dd');
      form.value['document_date'] = this.datePipe.transform(form.value['document_date'], 'yyyy-MM-dd');

      this.helpers.setPageSpinner(true);

      this.invoiceService.createTaxInvoices(
        this.data.ids,  this.data.criteria, form.value).then(response => {
        this.helpers.setPageSpinner(false);
        if (response['message'] !== 'success') {
          this.hasServerError = true;
          this.message = response['message'];
        } else {
          this.hasServerError = false;
          this.notificationService.success('נשמר בהצלחה.');
          this.dialogRef.close();
        }
      });
    }
  }
}
