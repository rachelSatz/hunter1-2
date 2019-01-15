import {Component, Inject, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import {Invoice} from '../../../../shared/_models/invoice.model';
import {InvoiceService} from '../../../../shared/_services/http/invoice.service';


@Component({
  selector: 'app-remarks-form',
  templateUrl: './remarks-form.component.html',
  styles: ['#styleFormat { height: 200px; padding-top: 20px }'],


})
export class RemarksFormComponent extends DataTableComponent implements OnInit {
  comments = [];
  comment: string;
  hasServerError: boolean;
  remarks = {}
  constructor(protected route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public invoice: Invoice,
              private dialogRef: MatDialogRef<RemarksFormComponent>, private invoiceService: InvoiceService) {
    super(route);
  }

  ngOnInit() {
    this.invoiceService.getInvoiceRemarks(this.invoice.id).then(response => this.remarks = response);
  }
  submit(): void {
    this.hasServerError = false;

    this.invoiceService.newComment(this.invoice.id, this.comment).then(response => {
      if (response) {
        this.dialogRef.close(this.comment);
      } else {
        this.hasServerError = true;
      }
    });
  }

  readonly headers: DataTableHeader[] =  [
    { column: 'empty_column', label: '' }, { column: 'ids_count', label: 'כמות ת"ז' },
    { column: 'rate', label: 'תעריף' }, { column: 'rate_type', label: 'סוג תעריף' },
    { column: 'total_amount', label: 'סה"כ' }
  ];
}
