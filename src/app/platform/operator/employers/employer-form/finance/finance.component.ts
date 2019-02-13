import { Component, OnInit } from '@angular/core';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import {
  CURRENCY,
  EmployerFinancialDetails, EmployerFinancialPayments, EmployerFinancialProduct,
  LANGUAGE,
  PAYMENT_METHOD,
  PAYMENT_TERMS, PAYMENT_TYPE, PRODUCT_TYPES,
  TAX
} from 'app/shared/_models/employer-financial-details.model';
import {NgForm} from '@angular/forms';
import {SelectUnitService} from '../../../../../shared/_services/select-unit.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css'],
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        height: '0'
      })),
      state('active', style({
        display: '*',
        height: '*'
      })),
      transition('active => inactive', animate('200ms')),
      transition('inactive => active', animate('200ms'))
    ])
  ]
})
export class FinanceComponent implements OnInit {
  financialDetails: EmployerFinancialDetails;
  hasServerError = false;
  rowIndex: number;
  additionalPayment: boolean;

  paymentTermsItems = Object.keys(PAYMENT_TERMS).map(function(e) {
    return { id: e, name: PAYMENT_TERMS[e] };
  });
  paymentMethodItems = Object.keys(PAYMENT_METHOD).map(function(e) {
    return { id: e, name: PAYMENT_METHOD[e] };
  });
  taxItems = Object.keys(TAX).map(function(e) {
    return { id: e, name: TAX[e] };
  });
  currencyItems = Object.keys(CURRENCY).map(function(e) {
    return { id: e, name: CURRENCY[e] };
  });
  languageItems = Object.keys(LANGUAGE).map(function(e) {
    return { id: e, name: LANGUAGE[e] };
  });
  productTypesItems = Object.keys(PRODUCT_TYPES).map(function(e) {
    return { id: e, name: PRODUCT_TYPES[e] };
  });
  paymentTypesItems = Object.keys(PAYMENT_TYPE).map(function(e) {
    return { id: e, name: PAYMENT_TYPE[e] };
  });

  constructor(private employerService: EmployerService,
              private selectUnit: SelectUnitService) { }

  ngOnInit() {
    this.employerService.getEmployerFinance(this.selectUnit.currentEmployerID).then(response =>
      this.financialDetails = response);
  }


  addProductRow(): void {
    this.financialDetails.financial_product.push(new EmployerFinancialProduct());
  }

  addPaymentRow(index: number): void {
      this.financialDetails.financial_product[index].financial_payments.push(new EmployerFinancialPayments());
  }

  showAdditionalPayment(index: number, isChecked: boolean): void {
    if (isChecked) {
      this.additionalPayment = true;
      this.rowIndex = index;
    } else {
      this.additionalPayment = false;
    }
  }

  submit(form: NgForm): void {
    this.hasServerError = false;
    if (form.valid) {
      if (this.financialDetails.id) {
        this.employerService.updateFinancialDetails(this.financialDetails.id, form.value)
          .then(response => {
              if (response['message'] !== 'success') {
                this.hasServerError = true;
                }
          });
        }
      } else {
        this.employerService.saveFinancialDetails(this.selectUnit.currentEmployerID, form.value)
          .then(response => {
            if (response['message'] !== 'success') {
              this.hasServerError = true;
            }
          });
      }
    }
}


