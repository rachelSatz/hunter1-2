import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import {
  CURRENCY,
  EmployerFinancialDetails,
  EmployerFinancialPayments,
  EmployerFinancialProduct,
  LANGUAGE,
  PAYMENT_METHOD,
  PAYMENT_TERMS,
  PAYMENT_TYPE,
  PRODUCT_TYPES,
  TAX
} from 'app/shared/_models/employer-financial-details.model';
import { fade } from 'app/shared/_animations/animation';
import {NotificationService} from '../../../../../shared/_services/notification.service';


@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css'],
  animations: [ fade ]
})
export class FinanceComponent implements OnInit {
  financialDetails: EmployerFinancialDetails = new EmployerFinancialDetails();
  hasServerError = false;
  rowIndex: number;
  additionalPayment: boolean;
  payEmployers: any;

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
              private selectUnit: SelectUnitService,
              private notificationService: NotificationService) { }

  ngOnInit() {
    this.employerService.getAllEmployers(null, true).then(
      response => this.payEmployers = response['items']);

    this.employerService.getEmployerFinance(this.selectUnit.currentEmployerID).then(response => {
      if (response.id) {
        this.financialDetails = response;
      }
    });

  }

  addProductRow(): void {
    this.financialDetails.financial_product.push(new EmployerFinancialProduct());
  }

  deleteProductRow(index: number): void {
    this.financialDetails.financial_product.splice(index, 1);
  }

  addPaymentRow(index: number): void {
      this.financialDetails.financial_product[index].financial_payments.push(new EmployerFinancialPayments());
  }

  deletePaymentRow(index1: number, index: number): void {
    this.financialDetails.financial_product[index1].financial_payments.splice(index, 1);
  }

  showAdditionalPayment(index: number, isChecked: boolean): void {
    if (isChecked) {
      this.additionalPayment = true;
      this.rowIndex = index;
    } else {
      this.additionalPayment = false;
    }
  }
  refresh(): void {
    window.location.reload();
  }

  submit(form: NgForm): void {
    this.hasServerError = false;
    if (form.valid) {
      this.employerService.saveFinancialDetails(this.selectUnit.currentEmployerID, this.financialDetails)
          .then(response => {
            if (response['message'] !== 'success') {
              this.hasServerError = true;
            } else {
              this.notificationService.success('נשמר בהצלחה.');
              // setTimeout(() => this.refresh(), 1000);
            }
          });
      }
    }
}


