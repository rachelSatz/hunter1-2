import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { fade } from '../../../../shared/_animations/animation';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../shared/_services/notification.service';
import { DatePipe } from '@angular/common';
import { DataTableComponent } from '../../../../shared/data-table/data-table.component';
import { NgForm } from '@angular/forms';
import { InvoiceService } from '../../../../shared/_services/http/invoice.service';

@Component({
  selector: 'app-tax-invoice-form',
  templateUrl: './tax-invoice-form.component.html',
  styles: ['#styleFormat { height: 200px; padding-top: 20px } .date { margin-right: 106px; }'],
  animations: [ fade ]
})
export class TaxInvoiceFormComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  hasServerError = false;
  message: string;
  include_email = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private helpers: HelpersService,
              private route: ActivatedRoute,
              private router: Router,
              private notificationService: NotificationService,
              private dialogRef: MatDialogRef<TaxInvoiceFormComponent>,
              public datePipe: DatePipe,
              private invoiceService: InvoiceService) { }

  ngOnInit() {
  }

  submit(form: NgForm): void {
    if (form.valid) {
      const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};
      const totalCheckedIds = this.data.dataTable.criteria.isCheckAll ? this.data.ids.length > 0 ?
        this.data.dataTable.paginationData.totalItems - this.data.ids.length : this.data.dataTable.paginationData.totalItems :
        this.data.ids.length;
      const text = '  האם ברצונך לשלוח חשבוניות מס/קבלה? נבחרו - ' + totalCheckedIds + ' רשומות';
      this.hasServerError = false;
      form.value['for_month'] = this.datePipe.transform(form.value['for_month'], 'yyyy-MM-dd');
      form.value['document_date'] = this.datePipe.transform(form.value['document_date'], 'yyyy-MM-dd');
      this.notificationService.warning(text, '', buttons).then(confirmation => {
        if (confirmation.value) {
          this.helpers.setPageSpinner(true);
          this.invoiceService.createTaxInvoices(
            this.data.ids,  this.data.dataTable.criteria, form.value).then(response => {
            this.helpers.setPageSpinner(false);
            if (response['message'] === 'success') {
              this.hasServerError = false;
              this.notificationService.success('נשמר בהצלחה.');
              this.dialogRef.close(true);
            } else if ('no_rows_selected') {
              this.hasServerError = false;
              this.notificationService.info('לא נמצאו רשומות מתאימות לשליחה');
              this.dialogRef.close(true);
            } else {
              this.hasServerError = true;
              this.message = response['message'];

            }
          });
        }
      });
    }
  }
}
