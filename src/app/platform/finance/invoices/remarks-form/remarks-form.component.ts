import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DataTableComponent } from '../../../../../app/shared/data-table/data-table.component';
import {Invoice, InvoiceDetailsRemarks, PRODUCT_RELATION_ENUM} from '../../../../shared/_models/invoice.model';
import { InvoiceService } from '../../../../shared/_services/http/invoice.service';
import { fade } from '../../../../shared/_animations/animation';
import { NotificationService } from '../../../../shared/_services/notification.service';


@Component({
  selector: 'app-remarks-form',
  templateUrl: './remarks-form.component.html',
  styles: ['#styleFormat { height: 200px; padding-top: 20px }'],
  animations: [ fade ]
})
export class RemarksFormComponent implements OnInit {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;
  comments = [];
  hasServerError = false;
  remarks: InvoiceDetailsRemarks;
  message = 'שגיאת שרת';
  product_relation_enum = PRODUCT_RELATION_ENUM;
  readonly columns  =  [
    { name : 'empty_column', label: '' , searchable: false},
    { name: 'ids_count', label: 'כמות ת"ז' , searchable: false},
    { name : 'rate', label: 'תעריף' , searchable: false},
    { name: 'rate_type', label: 'סוג תעריף' , searchable: false},
    { name : 'total_amount', label: 'סה"כ' , searchable: false}
  ];

  constructor(protected route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public invoice: Invoice,
              private dialogRef: MatDialogRef<RemarksFormComponent>,
              private invoiceService: InvoiceService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.invoiceService.getInvoiceRemarks(this.invoice.id).then(response => {
      this.remarks = response;});
  }
  displayText(productType: string) {
    return 'סכום לפי הגדרת מעסיק' + ' (' + this.product_relation_enum[productType] + ')';
  }

  submit(): void {
    this.hasServerError = false;
    this.invoiceService.newComment(this.invoice.id, this.remarks['content']).then(response => {
      if (response === true) {
        this.hasServerError = false;
        this.notificationService.success('נשמר בהצלחה.');
        this.dialogRef.close();
      } else {
        this.message = response['message'];
        this.hasServerError = true;
      }
    });
  }


}
