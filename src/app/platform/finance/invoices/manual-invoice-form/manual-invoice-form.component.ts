import {Component, OnInit, ViewChild} from '@angular/core';
import { fade } from '../../../../shared/_animations/animation';
import { ActivatedRoute, Router} from '@angular/router';
import { InvoiceService} from 'app/shared/_services/http/invoice.service';
import { EmployerService} from 'app/shared/_services/http/employer.service';
import {ManualInvoice, ManualInvoiceDetails} from '../../../../shared/_models/invoice.model';
import {EmployerFinancialPayments, TAX} from '../../../../shared/_models/employer-financial-details.model';

@Component({
  selector: 'app-manual-invoice-form',
  templateUrl: './manual-invoice-form.component.html',
  styleUrls: ['./manual-invoice-form.component.css'],
  styles: ['#styleFormat { height: 400px; padding-top: 20px }'],
  animations: [ fade ]

})
export class ManualInvoiceFormComponent implements OnInit {

  employers: any;
  readonly TAX = [
    {'id': 'before', 'name': 'מסמך רגיל'},
    {'id': 'included', 'name': 'מסמך ללא מע"מ (אילת וחו"ל)'}
  ];
  readonly TAXITEMS = [
    {'id': 'before', 'name': 'לא כולל'},
    {'id': 'included', 'name': 'כולל'}
  ];
  selected = 'before';
  manualInvoice: ManualInvoice = new ManualInvoice();
  totalBeforeTax = 0;
  tax = 0;
  totalIncludeTax = 0;
  isEdit = false;


  readonly columns  = [
    { name: 'tax', label: 'מע"מ', searchable: false},
    { name: 'description', label: 'פירוט' , searchable: false},
    { name: 'ids_count', label: 'כמות' , searchable: false},
    { name: 'payment_amount', label: 'מחיר ליחידה' , searchable: false},
    { name: 'total_amount', label: 'סה"כ' , searchable: false},
  ];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private invoiceService: InvoiceService,
              private employerService: EmployerService,  ) { }

  ngOnInit() {
    this.employerService.getAllEmployers(null, true).then(
      response => this.employers = response['items']);
  }

  saveInvoiceDetail(invoiceDetail: ManualInvoiceDetails, index: number): void {
    if (invoiceDetail !== null) {
      if (invoiceDetail.ids_count > 0 && invoiceDetail.payment_amount > 0) {
        if (invoiceDetail.tax === 'before') {
          invoiceDetail.total_payment_amount = +((invoiceDetail.ids_count * invoiceDetail.payment_amount).toFixed(2));
          invoiceDetail.tax_amount = +((invoiceDetail.total_payment_amount * 0.17).toFixed(2));
        } else {
          invoiceDetail.total_payment_amount =  +(((invoiceDetail.ids_count * invoiceDetail.payment_amount) / 1.17).toFixed(2));
          invoiceDetail.tax_amount = 0;
        }
        invoiceDetail.is_saved = true;
        this.totalBeforeTax += +((invoiceDetail.total_payment_amount).toFixed(2));
        this.tax += +((invoiceDetail.tax_amount).toFixed(2));
        this.totalIncludeTax += +((invoiceDetail.total_payment_amount + invoiceDetail.tax_amount).toFixed(2));
        this.isEdit = false;
      }
    }
  }

  editInvoiceDetailRow(invoiceDetail: ManualInvoiceDetails): void {
    this.totalBeforeTax -= +((invoiceDetail.total_payment_amount).toFixed(2));
    this.tax -= +((invoiceDetail.tax_amount).toFixed(2));
    this.totalIncludeTax -= +((invoiceDetail.total_payment_amount + invoiceDetail.tax_amount).toFixed(2));
    invoiceDetail.is_saved = false;
    this.isEdit = true;
  }

  addInvoiceDetailRow(): void {
    this.manualInvoice.invoice_details.push(new ManualInvoiceDetails());
  }

  deleteInvoiceDetailRow(invoiceDetail: ManualInvoiceDetails, index: number): void {
    this.totalBeforeTax -= +((invoiceDetail.total_payment_amount).toFixed(2));
    this.tax -= +((invoiceDetail.tax_amount).toFixed(2));
    this.totalIncludeTax -= +((invoiceDetail.total_payment_amount + invoiceDetail.tax_amount).toFixed(2));
    this.manualInvoice.invoice_details.splice(index, 1);
    if (index === 0) {
      this.addInvoiceDetailRow();
    }
  }
}
