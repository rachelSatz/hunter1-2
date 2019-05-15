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
  // saveInvoiceDetail(): void {
  //
  // }

  saveInvoiceDetail(invoiceDetail: ManualInvoiceDetails, index: number): void {
    if (invoiceDetail !== null) {
      if (invoiceDetail.ids_count > 0 && invoiceDetail.payment_amount > 0) {
        if (invoiceDetail.tax === 'before') {
          this.totalBeforeTax += +((invoiceDetail.ids_count * invoiceDetail.payment_amount).toFixed(2));
          this.tax += +((this.totalBeforeTax * 0.17).toFixed(2));
          this.totalIncludeTax = +((this.totalBeforeTax + this.tax).toFixed(2));
          invoiceDetail.total_payment_amount = +((invoiceDetail.ids_count * invoiceDetail.payment_amount).toFixed(2));
          this.manualInvoice.invoice_details.push(invoiceDetail);
          this.manualInvoice.invoice_details.splice(0, 1, new ManualInvoiceDetails());
          // this.manualInvoice.invoice_details.push(new ManualInvoiceDetails());
        } else {
          invoiceDetail.total_payment_amount =  +(((invoiceDetail.ids_count * invoiceDetail.payment_amount) / 1.17).toFixed(2));
          this.totalBeforeTax += +((invoiceDetail.ids_count * invoiceDetail.payment_amount).toFixed(2));
          this.tax += +((this.totalBeforeTax * 0.17).toFixed(2));
          this.totalIncludeTax = +((this.totalBeforeTax + this.tax).toFixed(2));
          this.manualInvoice.invoice_details.push(new ManualInvoiceDetails());
        }
      }
    }
  }

  addInvoiceDetailRow(): void {
    this.manualInvoice.invoice_details.push(new ManualInvoiceDetails());
  }

  deleteInvoiceDetailRow(index: number): void {
    this.manualInvoice.invoice_details.splice(index, 1);
  }
}
