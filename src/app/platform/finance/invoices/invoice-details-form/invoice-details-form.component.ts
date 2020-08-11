import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { fade } from 'app/shared/_animations/animation';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Invoice, InvoiceDetails } from 'app/shared/_models/invoice.model';
import { InvoiceService } from 'app/shared/_services/http/invoice.service';
import { NotificationService } from 'app/shared/_services/notification.service';

@Component({
  selector: 'app-invoice-details-form',
  templateUrl: './invoice-details-form.component.html',
  styleUrls: ['./invoice-details-form.component.css'],
  styles: ['#styleFormat { height: 200px; padding-top: 20px }'],
  animations: [ fade ]
})
export class InvoiceDetailsFormComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;
  invoiceDetails: InvoiceDetails;

  // readonly columns = [
  //   {name: 'empty_column', label: '', searchable: false},
  //   {name: 'ids_count', label: 'כמות ת"ז', searchable: false},
  //   {name: 'rate', label: 'תעריף', searchable: false},
  //   {name: 'rate_type', label: 'סוג תעריף', searchable: false},
  //   {name: 'total_amount', label: 'סה"כ', searchable: false}
  // ];

  constructor(protected route: ActivatedRoute,
              @Inject(MAT_DIALOG_DATA) public invoice: Invoice,
              private dialogRef: MatDialogRef<InvoiceDetailsFormComponent>,
              private invoiceService: InvoiceService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.invoiceService.getInvoiceDetails(this.invoice.id).then(response => {
      if (response['message'] === 'success') {
        this.invoiceDetails = response['data'];
      } else {
        this.notificationService.info('לא ניתן להציג את המידע');
      }
    });
  }

}
