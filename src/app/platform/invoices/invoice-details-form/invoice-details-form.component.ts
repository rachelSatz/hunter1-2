import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {fade} from '../../../shared/_animations/animation';
import {DataTableComponent} from '../../../shared/data-table/data-table.component';
import {Invoice, InvoiceDetails} from '../../../shared/_models/invoice.model';
import {ActivatedRoute} from '@angular/router';
import {MAT_DIALOG_DATA,MatDialogRef} from '@angular/material';
import {InvoiceService} from '../../../../app/shared/_services/http/invoice.service'
import {NotificationService} from '../../../shared/_services/notification.service';

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
  constructor(protected route: ActivatedRoute,
              @Inject(MAT_DIALOG_DATA) public invoice: Invoice,
              private dialogRef: MatDialogRef<InvoiceDetailsFormComponent>,
              private invoiceService: InvoiceService,
              private notificationService: NotificationService) { }

  ngOnInit() {
    this.invoiceService.getInvoiceDetails(this.invoice.id).then(response => {
        this.invoiceDetails = response as InvoiceDetails;
    });
  }

}
