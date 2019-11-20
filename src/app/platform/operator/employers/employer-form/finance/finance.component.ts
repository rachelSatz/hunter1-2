import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import {
  CURRENCY,
  EmployerFinancialDetails,
  EmployerFinancialPayments,
  EmployerFinancialProduct,
  LANGUAGE, NO_PAYMENT_TIME,
  PAYMENT_METHOD,
  PAYMENT_TERMS, PAYMENT_TIME,
  PAYMENT_TYPE,
  PRODUCT_TYPES,
  TAX
} from 'app/shared/_models/employer-financial-details.model';
import { fade } from 'app/shared/_animations/animation';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { NotificationService } from 'app/shared/_services/notification.service';


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
  isNoPaymentTime: boolean;
  openDatePicker = false;
  payEmployers: any;
  isEstablishingPayment: boolean;
  currentEmpId = 0;

  paymentTermsItems = Object.keys(PAYMENT_TERMS).map(function(e) {
    return { id: e, name: PAYMENT_TERMS[e] };
  });
  paymentMethodItems = Object.keys(PAYMENT_METHOD).map(function(e) {
    return { id: e, name: PAYMENT_METHOD[e] };
  });

  paymentTimeItems = Object.keys(PAYMENT_TIME).map(function(e) {
    return { id: e, name: PAYMENT_TIME[e] };
  });
  noPaymentTimeItems = Object.keys(NO_PAYMENT_TIME).map(function(e) {
    return { id: e, name: NO_PAYMENT_TIME[e] };
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
              public userSession: UserSessionService,
              private notificationService: NotificationService,
              public route: ActivatedRoute) { }

  ngOnInit() {
    this.employerService.getAllEmployers(null, true).then(
      response => {
        this.payEmployers = response['items'];
        this.employerService.getEmployerFinance(this.selectUnit.currentEmployerID).then(res => {
          if (res.id) {
            this.financialDetails = res;
            if (this.financialDetails != null && this.financialDetails.payment_time === 'no_payment') {
              this.isNoPaymentTime = true;
              if (this.financialDetails.payment_time_validity === 'month') {
                this.openDatePicker = true;
              }
            }
          } else {
            // this.financialDetails.currency = CURRENCY.ils;
            // this.financialDetails.language = LANGUAGE.he;
          }
        });
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

  showNoPaymentTime(): void {
    if (this.financialDetails.payment_time !== undefined && this.financialDetails.payment_time === 'no_payment') {
      this.isNoPaymentTime = true;
    } else {
      this.isNoPaymentTime = false;
    }
  }

  addEstablishing(isChecked: boolean): void {
    if (isChecked) {
      this.isEstablishingPayment = true;
    } else {
      this.isEstablishingPayment = false;
    }
  }

  selectDueDate(): void {
    if (this.financialDetails.payment_time_validity !== undefined && this.financialDetails.payment_time_validity === 'month') {
      this.openDatePicker = true;
    } else {
      this.openDatePicker = false;
    }
  }

  displayCheckedAdditional(product: EmployerFinancialProduct): boolean {
    if (product.additional_payment_amount > 0 && product.additional_payment_desc != null) {
      return true;
    } else {
      return false;
    }
  }

  refresh(): void {
    window.location.reload();
  }


  submit(form: NgForm): void {
    this.hasServerError = false;
    if (form.valid) {
      if (this.selectUnit.currentEmployerID === 0) {
        this.notificationService.error('לא נבחר מעסיק.');
      } else {
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
}


