import { Component, OnInit } from '@angular/core';
import { fade } from '../../../../shared/_animations/animation';
import { ManualInvoice, ManualInvoiceDetails } from '../../../../shared/_models/invoice.model';
import { PRODUCT_TYPES } from '../../../../shared/_models/employer-financial-details.model';
import { EmployerService } from '../../../../shared/_services/http/employer.service';
import { NgForm } from '@angular/forms';
import { InvoiceService } from '../../../../shared/_services/http/invoice.service';
import { MatDialogRef } from '@angular/material';
import { NotificationService } from '../../../../shared/_services/notification.service';

@Component({
  selector: 'app-manual-invoice-form',
  templateUrl: './manual-invoice-form.component.html',
  styleUrls: ['./manual-invoice-form.component.css'],
  styles: ['#styleFormat { height: 400px; padding-top: 20px }'],
  animations: [ fade ]
})
export class ManualInvoiceFormComponent implements OnInit {

  employers: any;
  manualInvoice: ManualInvoice = new ManualInvoice();
  totalBeforeTax = 0;
  tax = 0;
  totalIncludeTax = 0;
  isEdit = false;
  hasServerError = false;
  message: string;
  productTypes = Object.keys(PRODUCT_TYPES).map(function(e) {
    return { id: e, name: PRODUCT_TYPES[e] };
  });
  readonly TAX = [
    {'id': 'before', 'name': 'מסמך רגיל'},
    {'id': 'included', 'name': 'מסמך ללא מע"מ (אילת וחו"ל)'}
  ];
  readonly TAXITEMS = [
    {'id': 'before', 'name': 'לא כולל'},
    {'id': 'included', 'name': 'כולל'}
  ];
  readonly columns  = [
    { name: 'tax', label: 'מע"מ', searchable: false},
    { name: 'description', label: 'פירוט' , searchable: false},
    { name: 'ids_count', label: 'כמות' , searchable: false},
    { name: 'payment_amount', label: 'מחיר ליחידה' , searchable: false},
    { name: 'total_amount', label: 'סה"כ' , searchable: false},
  ];

  constructor(private employerService: EmployerService,
              private invoiceService: InvoiceService,
              private dialogRef: MatDialogRef<ManualInvoiceFormComponent>,
              private notificationService: NotificationService) { }

  ngOnInit() {
    this.employerService.getEmployers().then(
      response => this.employers = response['data']);
  }
  saveInvoiceDetail(invoiceDetail: ManualInvoiceDetails, index: number): void {
    if (invoiceDetail !== null) {
      if (invoiceDetail.ids_count > 0 && invoiceDetail.payment_amount > 0) {
        invoiceDetail.total_payment_amount = +((invoiceDetail.ids_count * invoiceDetail.payment_amount).toFixed(2));
          if (invoiceDetail.tax === 'included' && this.manualInvoice.tax_type === 'before') {
            invoiceDetail.tax_amount = +((invoiceDetail.total_payment_amount * 0.17).toFixed(2));
          } else {
            invoiceDetail.tax_amount = 0;
          }
        invoiceDetail.is_saved = true;
        this.totalBeforeTax += +((invoiceDetail.total_payment_amount).toFixed(2));
        if (this.manualInvoice.tax_type === 'before') {
          this.tax += +((invoiceDetail.tax_amount).toFixed(2));
        }
        this.totalIncludeTax += +((invoiceDetail.total_payment_amount + invoiceDetail.tax_amount).toFixed(2));
        this.isEdit = false;
      }
    }
  }

  editInvoiceDetailRow(invoiceDetail: ManualInvoiceDetails): void {
    this.totalBeforeTax -= +((invoiceDetail.total_payment_amount).toFixed(2));
    if (this.tax > 0) {
      this.tax -= +((invoiceDetail.tax_amount).toFixed(2));
    }
    if (this.totalIncludeTax > 0) {
      if (this.tax > 0) {
        this.totalIncludeTax -= +((invoiceDetail.total_payment_amount + invoiceDetail.tax_amount).toFixed(2));
      } else {
        this.totalIncludeTax -= invoiceDetail.total_payment_amount;
      }
    }
    invoiceDetail.is_saved = false;
    this.isEdit = true;
  }

  addInvoiceDetailRow(): void {
    this.manualInvoice.invoice_details.push(new ManualInvoiceDetails());
  }

  deleteInvoiceDetailRow(invoiceDetail: ManualInvoiceDetails, index: number, is_saved: boolean): void {
    if (is_saved) {
      this.totalBeforeTax -= +((invoiceDetail.total_payment_amount).toFixed(2));
      if (this.tax > 0) {
        this.tax -= +((invoiceDetail.tax_amount).toFixed(2));
      }
      this.totalIncludeTax -= +((invoiceDetail.total_payment_amount + invoiceDetail.tax_amount).toFixed(2));
    }
    this.manualInvoice.invoice_details.splice(index, 1);
    if (index === 0) {
      this.addInvoiceDetailRow();
    }
  }

  changeTaxType(): void {
    if (this.manualInvoice.tax_type !== undefined) {
      switch (this.manualInvoice.tax_type) {
        case 'before':
          this.tax = +((this.totalBeforeTax * 0.17).toFixed(2));
          this.totalIncludeTax += this.tax;
          break;
        case 'included':
          this.totalIncludeTax -= this.tax;
          this.tax = 0;
          break;
      }
    }
  }

  submit(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;
      this.invoiceService.createManualInvoice(this.manualInvoice).then(response => {
        this.message = response['message'];
        if (response['message'] !== 'success') {
          this.hasServerError = true;
          this.notificationService.error(response['message']);
        } else {
          this.notificationService.success('נשמר בהצלחה.');
          this.dialogRef.close();
        }
      });
    }
  }
}
