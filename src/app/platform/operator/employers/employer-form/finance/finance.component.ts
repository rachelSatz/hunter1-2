import { Component, OnInit } from '@angular/core';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import {
  CURRENCY,
  EmployerFinancialDetails,
  LANGUAGE,
  PAYMENT_METHOD,
  PAYMENT_TERMS,
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
  aaa = '123456'

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

  constructor(private employerService: EmployerService) { }

  ngOnInit() {
    // employerId
    this.employerService.getEmployerFinance(5).then(response =>
      this.financialDetails = response);
  }

  submit(form: NgForm): void {
    this.hasServerError = false;
    if (form.valid) {
      if (this.financialDetails.id) {
        this.employerService.updateFinancialDetails(this.financialDetails.id, this.financialDetails)
          .then(response => response);
      } else {
        this.employerService.saveFinancialDetails(this.financialDetails)
          .then(response => response);
      }
    }
  }


}


