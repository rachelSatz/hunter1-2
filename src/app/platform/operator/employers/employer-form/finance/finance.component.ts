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

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css']
})
export class FinanceComponent implements OnInit {
  financialDetails: EmployerFinancialDetails;
  hasServerError: boolean;
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

  constructor(private employerService: EmployerService) { }

  ngOnInit() {
    // employerId
    this.employerService.getEmployerFinance(5).then(response =>
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
          .then(response => response);
      } else {
        this.employerService.saveFinancialDetails(form.value)
          .then(response => response);
      }
    }
  }


}


